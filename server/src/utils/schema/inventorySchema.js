import Joi from 'joi';

export const SAVE_INVENTORIES_SCHEMA = Joi.object({
  productId: Joi.string().required(),
  userId: Joi.string().required(),
  supplierId: Joi.string().required(),
  vars: Joi.object({
    color: Joi.string(),
    size: Joi.string(),
  }),
  type: Joi.string(),
  quantity: Joi.number().integer().min(1).required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
export const UPDATE_INVENTORIES = Joi.object({
  productId: Joi.string().required(),
  userId: Joi.string().required(),
  supplierId: Joi.string().required(),
  vars: Joi.object({
    color: Joi.string(),
    size: Joi.string(),
  }),
  type: Joi.string(),
  quantity: Joi.number().integer().min(1).required(),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
