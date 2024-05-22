import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(20).required().alphanum(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .min(6)
    .max(11)
    .pattern(/^[0-9]+$/)
    .required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(20).alphanum(),
  email: Joi.string().email(),
  phone: Joi.string()
    .min(8)
    .max(11)
    .pattern(/^[0-9]+$/),
  favorite: Joi.boolean(),
});

export const updateContactFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});
