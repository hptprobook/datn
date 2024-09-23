import Joi from 'joi';
// import { ObjectId } from 'mongodb';

export const SAVE_USER_SCHEMA = Joi.object({
    //   password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    name: Joi.string().trim().min(1).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().trim().min(1).required(),
    phone: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(10)
        .max(15)
        .default(null),
    // otp: Joi.string(),
    refreshToken: Joi.string().default(null),
    role: Joi.string().valid('root', 'employee', 'user', 'ban').default('user'),
    allowNotifies: Joi.boolean().default(false),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_USER = Joi.object({
    name: Joi.string().min(1).max(30),
    password: Joi.string(),
    otp: Joi.string(),
    phone: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(10)
        .max(15)
        .default(null),
    refreshToken: Joi.string(),
    role: Joi.string().valid('root', 'employee', 'user', 'ban').default('user'),
    allowNotifies: Joi.boolean().default(false),
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
