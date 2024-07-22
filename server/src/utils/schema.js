/* eslint-disable comma-dangle */
import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

export const SAVE_USER_SCHEMA = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  //   password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  passWord: Joi.string().required(),
  otp: Joi.string(),
  getNotify: Joi.boolean().default(false),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .default(null),
  addresses: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('home', 'work', 'other').default('home'),
      fullName: Joi.string().max(50),
      commune: Joi.string(),
      district: Joi.string(),
      province: Joi.string(),
      detail: Joi.string(),
      isDefault: Joi.boolean().default(false),
    })
  ),
  role: Joi.string().valid('user', 'admin', 'ban').default('user'),
  avatar: Joi.string().default(null),
  dateOfBirth: Joi.date().max('now').default(null),
  gender: Joi.string().valid('male', 'female', 'other').default('other'),
  favoriteProducts: Joi.array().items(
    Joi.object({
      product_id: Joi.string(),
      price_id: Joi.string(),
    })
  ),
  cart: Joi.array().items(
    Joi.object({
      product_id: Joi.string(),
      price_id: Joi.string(),
      quantity: Joi.number().integer().min(1),
    })
  ),
  // lastLogin: Joi.date(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_USER = Joi.object({
  username: Joi.string().min(3).max(30),
  // email: Joi.string().email().required(),
  //   password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  passWord: Joi.string(),
  otp: Joi.string(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .default(null),
  addresses: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('home', 'work', 'other').default('home'),
      fullName: Joi.string().max(50),
      commune: Joi.string(),
      district: Joi.string(),
      province: Joi.string(),
      detail: Joi.string(),
      isDefault: Joi.boolean().default(false),
    })
  ),
  role: Joi.string().valid('user', 'admin', 'ban').default('user'),
  avatar: Joi.string().default(null),
  dateOfBirth: Joi.date().max('now').default(null),
  gender: Joi.string().valid('male', 'female', 'other').default('other'),
  favoriteProducts: Joi.array().items(
    Joi.object({
      product_id: Joi.string(),
      // price_id: Joi.string(),
    })
  ),
  cart: Joi.array().items(
    Joi.object({
      product_id: Joi.string(),
      price_id: Joi.string(),
      quantity: Joi.number().integer().min(1),
    })
  ),
  // lastLogin: Joi.date(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
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
