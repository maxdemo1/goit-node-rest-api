import Joi from "joi";

export const registerUserSchema = Joi.object({
  name: Joi.string().min(2).max(20).required().alphanum(),
  email: Joi.string().email().required(),
});
