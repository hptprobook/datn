import Joi from 'joi';

export const SAVE_BRAND = Joi.object({
  name: Joi.string().trim().not().empty().required(),
  slug: Joi.string().trim().not().empty().required(),
  content: Joi.string().trim().not().empty().required(),
  image: Joi.string().trim().not().empty().required(),
  status: Joi.boolean().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_BRAND = Joi.object({
  name: Joi.string().trim().not().empty(),
  slug: Joi.string().trim().not().empty(),
  content: Joi.string().trim().not().empty(),
  image: Joi.string().trim().not().empty(),
  status: Joi.boolean(),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
