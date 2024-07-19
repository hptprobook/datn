/* eslint-disable comma-dangle */
import Joi from 'joi';
import { ObjectId } from 'mongodb';

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
  name: Joi.string().required(),
  imageURL: Joi.string().required(),
  description: Joi.string().required(),
  slug: Joi.string().required(),
  parentId: Joi.alternatives().try(Joi.string(), Joi.allow(null)),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_CATEGORY = Joi.object({
  name: Joi.string().required(),
  imageURL: Joi.string().required(),
  description: Joi.string().required(),
  slug: Joi.string().required(),
  parentId: Joi.alternatives().try(Joi.string(), Joi.allow(null)),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

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

export const SAVE_PRODUCT_SCHEMA = Joi.object({
  cat_id: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.object({
    short: Joi.alternatives().try(Joi.string(), Joi.allow(null)),
    long: Joi.string().required(),
  }).required(),
  imgURLs: Joi.array().items(Joi.string()).required(),
  price: Joi.number().precision(2).required(),
  brand: Joi.string(),
  views: Joi.number().integer().default(0),
  stock: Joi.number().precision(2).required(),
  tags: Joi.array().items(Joi.string()),
  slug: Joi.string(),
  vars: Joi.array().items(
    Joi.object({
      color: Joi.string(),
      size: Joi.string(),
      stock: Joi.string(),
      imageURL: Joi.alternatives().try(Joi.string(), Joi.allow(null)),
      price: Joi.number().precision(2).required(),
    })
  ),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_PRODUCT = Joi.object({
  cat_id: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.object({
    short: Joi.alternatives().try(Joi.string(), Joi.allow(null)),
    long: Joi.string().required(),
  }).required(),
  imgURLs: Joi.array().items(Joi.string()).required(),
  price: Joi.number().precision(2).required(),
  brand: Joi.string(),
  views: Joi.number().integer().default(0),
  stock: Joi.number().precision(2).required(),
  tags: Joi.array().items(Joi.string()),
  slug: Joi.string(),
  vars: Joi.array().items(
    Joi.object({
      color: Joi.string(),
      size: Joi.string(),
      stock: Joi.string(),
      imageURL: Joi.alternatives().try(Joi.string(), Joi.allow(null)),
      price: Joi.number().precision(2).required(),
    })
  ),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
