import Joi from 'joi';

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
            stock: Joi.number(),
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
            stock: Joi.number(),
            imageURL: Joi.alternatives().try(Joi.string(), Joi.allow(null)),
            price: Joi.number().precision(2).required(),
        })
    ),
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});