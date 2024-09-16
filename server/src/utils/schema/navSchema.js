import Joi from 'joi';

export const DASHBOARD_SCHEMA = Joi.object({
    title: Joi.string().min(1).max(60).required(),
    path: Joi.string().min(1).max(60).required(),
    icon: Joi.string().min(1).max(60).required(),
    child: Joi.array().items(Joi.object({
        title: Joi.string().min(1).max(60),
        icon: Joi.string().min(1).max(60),
        path: Joi.string().min(1).max(60),
    })),
    index: Joi.number().required().messages({
        'number.base': 'Index phải là số',
        'any.required': 'Index không được bỏ trống',
    }),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
export const DASHBOARD_SCHEMA_UPDATE = Joi.object({
    title: Joi.string().min(1).max(60),
    path: Joi.string().min(1).max(60),
    icon: Joi.string().min(1).max(60),
    child: Joi.array().items(Joi.object({
        title: Joi.string().min(1).max(60),
        icon: Joi.string().min(1).max(60),
        path: Joi.string().min(1).max(60),
    })),
    index: Joi.number().messages({
        'number.base': 'Index phải là số',
    }),
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});