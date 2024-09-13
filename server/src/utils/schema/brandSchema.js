/* eslint-disable comma-dangle */
import Joi from 'joi';

export const SAVE_BRAND_SCHEMA = Joi.object({
  name: Joi.string().trim().not().empty().required(),
  slug: Joi.string().trim().not().empty().required(),
  content: Joi.string().trim().not().empty().required(),
  image: Joi.alternatives().try(Joi.string(), Joi.allow(null)),
  status: Joi.boolean().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
