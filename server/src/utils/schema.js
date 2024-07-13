/* eslint-disable comma-dangle */
import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

export const SAVE_USER_SCHEMA = Joi.object({
  //   password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  name: Joi.object({
    firstName: Joi.string().min(1).max(30).required(),
    lastName: Joi.string().min(1).max(30).required(),
  }),
  email: Joi.string().email().required(),
  passWord: Joi.string().required(),
  otp: Joi.string(),
  addresses: Joi.array().items(
    Joi.object({
      name: Joi.string().max(50),
      homeNumber: Joi.string().max(50),
      street: Joi.string(),
      ward: Joi.string(),
      district: Joi.string(),
      province: Joi.string(),
      isDefault: Joi.boolean().default(false),
      note: Joi.string(),
    })
  ),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .default(null),
  role: Joi.string().valid('root', 'employee', 'user', 'ban').default('user'),
  allowNotifies: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_USER = Joi.object({
  name: Joi.object({
    firstName: Joi.string().min(1).max(30),
    lastName: Joi.string().min(1).max(30),
  }),
  passWord: Joi.string(),
  otp: Joi.string(),

  addresses: Joi.array().items(
    Joi.object({
      name: Joi.string().max(50),
      homeNumber: Joi.string().max(50),
      street: Joi.string(),
      ward: Joi.string(),
      district: Joi.string(),
      province: Joi.string(),
      isDefault: Joi.boolean().default(false),
      note: Joi.string(),
    })
  ),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .default(null),
  role: Joi.string().valid('root', 'employee', 'user', 'ban').default('user'),
  allowNotifies: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const SAVE_CATEGORY_SCHEMA = Joi.object({
  title: Joi.string().required(),
  list: Joi.array().items(
    Joi.object({
      // id: Joi.string().required(),
      title: Joi.string().max(50),
      list: Joi.array().items(
        Joi.object({
          // id: Joi.string().required(),
          title: Joi.string().max(50),
        })
      ),
    })
  ),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
});
