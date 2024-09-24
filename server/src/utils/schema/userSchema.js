import Joi from 'joi';

export const SAVE_USER_SCHEMA = Joi.object({
    name: Joi.string().trim().min(1).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().trim().min(1).required(),
    otp: Joi.string(),
    addresses: Joi.array().items(
        Joi.object({
            name: Joi.string().max(50),
            phone: Joi.string().max(50),
            province_id: Joi.number().integer(),
            district_id: Joi.number().integer(),
            ward_id: Joi.number().integer(),
            address: Joi.string(),
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
    name: Joi.string().trim().min(1).max(30).required(),
    password: Joi.string().trim().min(1).required(),
    otp: Joi.string(),
    addresses: Joi.array().items(
        Joi.object({
            name: Joi.string().max(50),
            phone: Joi.string().max(50),
            province_id: Joi.number().integer(),
            district_id: Joi.number().integer(),
            ward_id: Joi.number().integer(),
            address: Joi.string(),
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
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
