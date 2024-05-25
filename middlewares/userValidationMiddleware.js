import {
  registerUserSchema,
  subscriptionSchema,
} from "../schemas/usersValidationSchema.js";
import HttpError from "../helpers/HttpError.js";

export const UserDataValidation = (req, res, next) => {
  const { error, _ } = registerUserSchema.validate({ ...req.body });
  if (error === undefined) {
    return next();
  }
  console.error(error);
  next(HttpError(400, error.message));
};

export const subscriptionTypeValidation = (req, res, next) => {
  const { error, _ } = subscriptionSchema.validate({ ...req.body });
  if (error === undefined) {
    return next();
  }
  console.error(error);
  next(HttpError(400, error.message));
};
