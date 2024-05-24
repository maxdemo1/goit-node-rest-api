import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import userModel from "../schemas/usersMongooseSchema.js";

export const checkToken = (req, res, next) => {
  if (req.headers.authorization === undefined) {
    return next(HttpError(401, "Not authorized"));
  }

  const [bearer, userToken] = req.headers.authorization.split(" ", 2);

  if (typeof req.headers.authorization !== "string" || bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }

  jwt.verify(userToken, process.env.TOKEN_SECRET, async (err, tokenData) => {
    if (err) {
      return next(HttpError(401, "Not authorized"));
    }
    try {
      const user = await userModel.findById(tokenData.id);
      if (
        user === null ||
        user.id !== tokenData.id ||
        userToken !== user.token
      ) {
        return next(HttpError(401, "Not authorized"));
      }

      req.user = { id: user.id, email: user.email };

      next();
    } catch (error) {
      console.log(error);
      next(HttpError(500));
    }
  });
};
