import Joi from 'joi';

export const SAVE_WAREHOUSES = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.empty': 'Tên không được để trống',
        'any.required': 'Tên là bắt buộc',
    }),
    location: Joi.string().trim().required().messages({
        'string.empty': 'Địa chỉ không được để trống',
        'any.required': 'Địa chỉ là bắt buộc',
    }),
    longitude: Joi.number().default(null),
    latitude: Joi.number().default(null),
    province_id: Joi.number().integer(),
    district_id: Joi.number().integer(),
    ward_id: Joi.number().integer(),
    status: Joi.string()
        .valid('Hoạt động', 'Đóng cửa', 'Đầy kho')
        .default('Hoạt động')
        .trim()
        .messages({
            'any.only': 'Trạng thái của kho gồm "Hoạt động", "Đóng cửa", "Đầy kho"',
        }),
    capacity: Joi.number().integer().default(10000),
    currentQuantity: Joi.number().integer().default(0),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_WAREHOUSES = Joi.object({
    name: Joi.string().trim().messages({
        'string.empty': 'Tên không được để trống',
    }),
    location: Joi.string().trim().messages({
        'string.empty': 'Địa chỉ không được để trống',
    }),
    longitude: Joi.number().default(null),
    latitude: Joi.number().default(null),
    province_id: Joi.number().integer(),
    district_id: Joi.number().integer(),
    ward_id: Joi.number().integer(),
    status: Joi.string()
        .valid('Hoạt động', 'Đóng cửa', 'Đầy kho')
        .default('Hoạt động')
        .trim()
        .messages({
            'any.only': 'Trạng thái của kho gồm "Hoạt động", "Đóng cửa", "Đầy kho"',
        }),
    capacity: Joi.number().integer(),
    currentQuantity: Joi.number().integer(),
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
