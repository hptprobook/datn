const Joi = require('joi');

export const CREATE_COUPONS = Joi.object({
    code: Joi.string().trim().required().messages({
        'string.base': 'Mã khuyến mãi phải là một chuỗi văn bản.',
        'string.empty': 'Mã khuyến mãi không được để trống.',
        'any.required': 'Mã khuyến mãi là bắt buộc.',
    }),
    type: Joi.string().trim().valid('percent', 'price', 'shipping').required().messages({
        'string.base': 'Loại khuyến mãi phải là một chuỗi văn bản.',
        'string.empty': 'Loại khuyến mãi không được để trống.',
        'any.only': 'Loại khuyến mãi phải là một trong các giá trị sau: percent, price, shipping',
        'any.required': 'Loại khuyến mãi là bắt buộc.',
    }),
    applicableProducts: Joi.array().items(Joi.string().trim()).min(1).required().messages({
        'array.base': 'Sản phẩm áp dụng phải là một mảng.',
        'array.min': 'Số lượng sản phẩm áp dụng phải lơn hơn hoặc bằng {#limit}',
        'any.required': 'Sản phẩm áp dụng là bắt buộc.',
    }),
    minPurchasePrice: Joi.number().min(1).messages({
        'number.base': 'Giá trị mua tối thiểu phải là một số.',
        'number.min': 'Giá trị mua tối thiểu phải lớn hơn hoặc bằng {#limit}.',
    }),
    discountValue: Joi.number().min(1).messages({
        'number.base': 'Giá trị khuyến mãi phải là một số.',
        'number.min': 'Giá trị khuyến mãi phải lớn hơn hoặc bằng {#limit}.',
    }),
    description: Joi.string().trim().required().messages({
        'string.base': 'Mô tả khuyến mãi phải là một chuỗi văn bản.',
        'string.empty': 'Mô tả khuyến mãi không được để trống.',
        'any.required': 'Mô tả khuyến mãi là bắt buộc.',
    }),
    usageLimit: Joi.number().integer().min(1).messages({
        'number.base': 'Giới hạn sử dụng phải là một số nguyên.',
        'number.integer': 'Giới hạn sử dụng phải là một số nguyên.',
        'number.min': 'Giới hạn sử dụng phải lớn hơn hoặc bằng {#limit}.',
    }),
    usageCount: Joi.number().integer().min(1).messages({
        'number.base': 'Số lần sử dụng phải là một số nguyên.',
        'number.integer': 'Số lần sử dụng phải là một số nguyên.',
        'number.min': 'Số lần sử dụng phải lớn hơn hoặc bằng {#limit}.',
    }),
    status: Joi.string().trim().min(1).valid('active', 'unactive', 'expired').default('active').messages({
        'string.base': 'Trạng thái phải là một chuỗi văn bản.',
        'string.empty': 'Trạng thái không được để trống.',
        'any.only': 'Trạng thái phải là một trong các giá trị sau: active, unactive, expired.',
    }),
    quantity: Joi.number().integer().min(1).messages({
        'number.base': 'Số lượng phải là một số nguyên.',
        'number.integer': 'Số lượng phải là một số nguyên.',
        'number.min': 'Số lượng phải lớn hơn hoặc bằng {#limit}.',
    }),
    dateStart: Joi.date().timestamp('javascript').default(Date.now),
    dateEnd: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_COUPONS = Joi.object({
    code: Joi.string().trim().messages({
        'string.base': 'Mã khuyến mãi phải là một chuỗi văn bản.',
        'string.empty': 'Mã khuyến mãi không được để trống.',
    }),
    type: Joi.string().trim().valid('percent', 'price', 'shipping').messages({
        'string.base': 'Loại khuyến mãi phải là một chuỗi văn bản.',
        'string.empty': 'Loại khuyến mãi không được để trống.',
        'any.only': 'Loại khuyến mãi phải là một trong các giá trị sau: percent, price, shipping',
    }),
    applicableProducts: Joi.array().items(Joi.string().trim()).min(1).messages({
        'array.base': 'Sản phẩm áp dụng phải là một mảng.',
        'array.min': 'Số lượng sản phẩm áp dụng phải lơn hơn hoặc bằng {#limit}',
    }),
    minPurchasePrice: Joi.number().min(1).messages({
        'number.base': 'Giá trị mua tối thiểu phải là một số.',
        'number.min': 'Giá trị mua tối thiểu phải lớn hơn hoặc bằng {#limit}.',
    }),
    discountValue: Joi.number().min(1).messages({
        'number.base': 'Giá trị khuyến mãi phải là một số.',
        'number.min': 'Giá trị khuyến mãi phải lớn hơn hoặc bằng {#limit}.',
    }),
    description: Joi.string().trim().messages({
        'string.base': 'Mô tả khuyến mãi phải là một chuỗi văn bản.',
        'string.empty': 'Mô tả khuyến mãi không được để trống.',
    }),
    usageLimit: Joi.number().integer().min(1).messages({
        'number.base': 'Giới hạn sử dụng phải là một số nguyên.',
        'number.integer': 'Giới hạn sử dụng phải là một số nguyên.',
        'number.min': 'Giới hạn sử dụng phải lớn hơn hoặc bằng {#limit}.',
    }),
    usageCount: Joi.number().integer().min(1).messages({
        'number.base': 'Số lần sử dụng phải là một số nguyên.',
        'number.integer': 'Số lần sử dụng phải là một số nguyên.',
        'number.min': 'Số lần sử dụng phải lớn hơn hoặc bằng {#limit}.',
    }),
    status: Joi.string().trim().min(1).valid('active', 'unactive', 'expired').default('active').messages({
        'string.base': 'Trạng thái phải là một chuỗi văn bản.',
        'string.empty': 'Trạng thái không được để trống.',
        'any.only': 'Trạng thái phải là một trong các giá trị sau: active, unactive, expired.',
    }),
    quantity: Joi.number().integer().min(1).messages({
        'number.base': 'Số lượng phải là một số nguyên.',
        'number.integer': 'Số lượng phải là một số nguyên.',
        'number.min': 'Số lượng phải lớn hơn hoặc bằng {#limit}.',
    }),
    dateStart: Joi.date().timestamp('javascript').default(Date.now),
    dateEnd: Joi.date().timestamp('javascript').default(Date.now),
});