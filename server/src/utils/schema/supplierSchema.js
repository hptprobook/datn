import Joi from 'joi';

export const SAVE_SUPPLIER_SCHEMA = Joi.object({
  fullName: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
});

export const UPDATE_SUPPLIER = Joi.object({
  fullName: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
});
