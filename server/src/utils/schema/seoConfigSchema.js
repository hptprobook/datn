/* eslint-disable comma-dangle */
import Joi from 'joi';
export const SAVE_SEOCONFIG = Joi.object({
  metaTitle: Joi.string().trim().not().empty().required(),
  metaDescription: Joi.string().trim().not().empty().required(),
  // metaKeywords: Joi.array().min(1).required(),
  metaKeywords: Joi.string().required(),
  metaRobots: Joi.string()
    .valid('index', 'noindex', 'follow', 'nofollow')
    .default('index')
    .trim()
    .not()
    .empty()
    .required(),
  metaOGImg: Joi.string().trim().not().empty().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_SEOCONFIG = Joi.object({
  metaTitle: Joi.string().trim().not().empty(),
  metaDescription: Joi.string().trim().not().empty(),
  metaKeywords: Joi.array().min(1),
  // metaKeywords: Joi.string().trim().not().empty(),
  metaRobots: Joi.string()
    .valid('index', 'noindex', 'follow', 'nofollow')
    .default('index')
    .trim()
    .not()
    .empty(),
  metaOGImg: Joi.string().trim().not().empty(),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
