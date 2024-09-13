import Joi from 'joi';

export const SAVE_CATEGORY_SCHEMA = Joi.object({
  name: Joi.string().required(),
  imageURL: Joi.alternatives().try(Joi.string(), Joi.allow(null)),
  description: Joi.string().required(),
  slug: Joi.string().required(),
  parentId: Joi.alternatives().try(Joi.string(), Joi.allow(null)),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_CATEGORY = Joi.object({
  name: Joi.string().required(),
  imageURL: Joi.string(),
  description: Joi.string().required(),
  slug: Joi.string().required(),
  parentId: Joi.alternatives().try(Joi.string(), Joi.allow(null)),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
