import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../../schemas/usersMongooseSchema.js";
import HttpError from "../../helpers/HttpError.js";

export const registerUser = async (req, res, next) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const newUserData = {
      email: req.body.email,
      password: hashPassword,
      subscription: req.body.subscription || "starter",
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
    res.status(200).send({ token, user: { email, password } });
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
