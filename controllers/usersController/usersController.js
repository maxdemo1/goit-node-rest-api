import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import path from "node:path";
import * as fs from "node:fs/promises";

import userModel from "../../schemas/usersMongooseSchema.js";
import HttpError from "../../helpers/HttpError.js";

export const registerUser = async (req, res, next) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const avatarURL = gravatar.url(req.body.email, { s: "100" }, true);

    const newUserData = {
      email: req.body.email,
      password: hashPassword,
      subscription: req.body.subscription || "starter",
      avatarURL,
    };
    const newUser = await userModel.create(newUserData);
    res.status(201).send({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    if (error.message.split(" ")[0] === "E11000") {
      next(HttpError(409, "Email in use"));
    }
    next(HttpError(error.status));
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const isUser = await userModel.findOne({ email });
    if (isUser === null) {
      console.log("Email not registered");
      return next(HttpError(401, "Email or password is wrong"));
    }
    const isPassword = await bcrypt.compare(password, isUser.password);
    if (!isPassword) {
      console.log("Incorrect password");
      return next(HttpError(401, "Email or password is wrong"));
    }

    const token = jwt.sign(
      { id: isUser._id, email },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    await userModel.findByIdAndUpdate(isUser._id, { token }, { new: true });
    res
      .status(200)
      .send({ token, user: { email, subscription: isUser.subscription } });
  } catch (error) {
    return next(HttpError(error.status));
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.user.id, {
      token: null,
    });
    res.status(204).send();
  } catch (error) {
    return next(HttpError(error.status));
  }
};

export const getUserData = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);

    res.send({ email: user.email, subscription: user.subscription });
  } catch (error) {
    return next(HttpError(error.status));
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        subscription: req.body.subscription,
      },
      { new: true }
    );
    res.send(user);
  } catch (error) {
    next(HttpError(error.status));
  }
};

export const setNewAvatar = async (req, res, next) => {
  if (req.file === undefined) {
    next(HttpError(400, "No image in request"));
  }
  try {
    await Jimp.read(req.file.path).then((image) => {
      return image.resize(250, 250).write(req.file.path);
    });

    const avatarPath = path.resolve("public", "avatars", req.file.filename);
    await fs.rename(req.file.path, avatarPath);

    const newUserData = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        avatarURL: path.join("avatars", req.file.filename),
      },
      { new: true }
    );

    res.send({ avatarURL: newUserData.avatarURL });
  } catch (error) {
    console.log(error);
    next(HttpError(error.status));
  }
};
