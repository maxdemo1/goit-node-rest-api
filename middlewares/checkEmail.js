import HttpError from "../helpers/HttpError.js";
import { checkEmailSchema } from "../schemas/checkEmailSchema.js";

export const checkEmail = (req, res, next) => {
  const { error, _ } = checkEmailSchema.validate({ ...req.body });
  if (error === undefined) {
    return next();
  }
  console.error(error);
  next(HttpError(400, "missing required field email"));
};
