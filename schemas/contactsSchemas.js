import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(20).required().alphanum(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .min(4)
    .max(11)
    .pattern(/^[0-9]+$/)
    .required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(20).alphanum(),
  email: Joi.string().email(),
  phone: Joi.string()
    .min(4)
    .max(11)
    .pattern(/^[0-9]+$/),
});
