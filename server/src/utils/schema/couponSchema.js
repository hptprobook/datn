const Joi = require('joi');

export const CREATE_COUPONS = Joi.object({
    name: Joi.string().trim().required().max(255).messages({
        'string.base': 'Tên khuyến mãi phải là một chuỗi văn bản.',
        'string.empty': 'Tên khuyến mãi không được để trống.',
        'any.required': 'Tên khuyến mãi là bắt buộc.',
        'string.max': 'Tên khuyến mãi không được vượt quá 255 ký tự.',
    }),
    code: Joi.string().trim().required().max(20).min(4).messages({
        'string.base': 'Mã khuyến mãi phải là một chuỗi văn bản.',
        'string.empty': 'Mã khuyến mãi không được để trống.',
        'any.required': 'Mã khuyến mãi là bắt buộc.',
        'string.max': 'Mã khuyến mãi không được vượt quá {#limit} ký tự.',
        'string.min': 'Mã khuyến mãi phải có ít nhất {#limit} ký tự.',
    }),
    type: Joi.string().trim().valid('percent', 'price', 'shipping').required().messages({
        'string.base': 'Loại khuyến mãi phải là một chuỗi văn bản.',
        'string.empty': 'Loại khuyến mãi không được để trống.',
        'any.only': 'Loại khuyến mãi phải là một trong các giá trị sau: percent, price, shipping',
        'any.required': 'Loại khuyến mãi là bắt buộc.',
    }).default('percent'),
    applicableProducts: Joi.array().items(Joi.string().trim()).messages({
        'array.base': 'Sản phẩm áp dụng phải là một mảng.',
    }).default([]),
    minPurchasePrice: Joi.number().min(0).max(99999999).messages({
        'number.base': 'Giá trị mua tối thiểu phải là một số.',
        'number.min': 'Giá trị mua tối thiểu phải lớn hơn hoặc bằng {#limit}.',
        'number.max': 'Giá trị mua tối thiểu không được vượt quá {#limit}.',
    }),
    maxPurchasePrice: Joi.number()
        .min(Joi.ref('minPurchasePrice'))
        .max(99999999)
        .when('minPurchasePrice', {
            is: Joi.exist(),  // Nếu có giá trị minPurchasePrice
            then: Joi.number().min(Joi.ref('minPurchasePrice')),  // maxPurchasePrice phải lớn hơn hoặc bằng minPurchasePrice
            otherwise: Joi.number().allow(null),  // Nếu không có giá trị minPurchasePrice, bỏ qua kiểm tra
        })
        .messages({
            'number.base': 'Giá trị mua tối đa phải là một số.',
            'number.min': 'Giá trị mua tối đa phải lớn hơn hoặc bằng giá trị mua tối thiểu.',
            'number.max': 'Giá trị mua tối đa không được vượt quá {#limit}.',
        }),
    discountValue: Joi.number().min(0).max(99999999).messages({
        'number.base': 'Giá trị khuyến mãi phải là một số.',
        'number.min': 'Giá trị khuyến mãi phải lớn hơn hoặc bằng {#limit}.',
        'number.max': 'Giá trị khuyến mãi không được vượt quá {#limit}.',
        'number.empty': 'Giá trị khuyến mãi không được để trống.',
    }),
    discountPercent: Joi.number().min(0).max(100).messages({
        'number.base': 'Phần trăm khuyến mãi phải là một số.',
        'number.min': 'Phần trăm khuyến mãi phải lớn hơn hoặc bằng {#limit}.',
        'number.max': 'Phần trăm khuyến mãi không được vượt quá {#limit}.',
    }),
    description: Joi.string().trim().min(10).max(255).messages({
        'string.base': 'Mô tả khuyến mãi phải là một chuỗi văn bản.',
        'string.min': 'Mô tả khuyến mãi phải có ít nhất {#limit} ký tự.',
        'string.max': 'Mô tả khuyến mãi không được vượt quá {#limit} ký tự.',
    }),
    usageLimit: Joi.number().integer().min(1).max(99999).messages({
        'number.base': 'Giới hạn sử dụng phải là một số nguyên.',
        'number.integer': 'Giới hạn sử dụng phải là một số nguyên.',
        'number.min': 'Giới hạn sử dụng phải lớn hơn hoặc bằng {#limit}.',
        'number.max': 'Giới hạn sử dụng không được vượt quá {#limit}.',
    }),
    usageCount: Joi.number().integer().max(99999).messages({
        'number.base': 'Số lần sử dụng phải là một số nguyên.',
        'number.integer': 'Số lần sử dụng phải là một số nguyên.',
        'number.max': 'Số lần sử dụng không được vượt quá {#limit}.',
    }).default(0),
    status: Joi.string().trim().min(1).valid('active', 'inactive', 'expired').default('active').messages({
        'string.base': 'Trạng thái phải là một chuỗi văn bản.',
        'string.empty': 'Trạng thái không được để trống.',
        'any.only': 'Trạng thái phải là một trong các giá trị sau: active, inactive, expired.',
    }),
    limitOnUser: Joi.boolean().default(false)
        .messages({
            'boolean.base': 'Giới hạn sử dụng cho mỗi người dùng phải là một giá trị boolean.',
        }),
    dateStart: Joi.date().timestamp('javascript').default(Date.now),
    dateEnd: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_COUPONS = Joi.object({
    name: Joi.string().trim().max(255).messages({
        'string.base': 'Tên khuyến mãi phải là một chuỗi văn bản.',
        'string.empty': 'Tên khuyến mãi không được để trống.',
        'string.max': 'Tên khuyến mãi không được vượt quá 255 ký tự.',
    }),
    code: Joi.string().trim().messages({
        'string.base': 'Mã khuyến mãi phải là một chuỗi văn bản.',
        'string.empty': 'Mã khuyến mãi không được để trống.',
    }),
    type: Joi.string().trim().valid('percent', 'price', 'shipping').messages({
        'string.base': 'Loại khuyến mãi phải là một chuỗi văn bản.',
        'string.empty': 'Loại khuyến mãi không được để trống.',
        'any.only': 'Loại khuyến mãi phải là một trong các giá trị sau: percent, price, shipping',
    }),
    applicableProducts: Joi.array().items(Joi.string().trim()).messages({
        'array.base': 'Sản phẩm áp dụng phải là một mảng.',
    }),
    minPurchasePrice: Joi.number().min(1).messages({
        'number.base': 'Giá trị mua tối thiểu phải là một số.',
        'number.min': 'Giá trị mua tối thiểu phải lớn hơn hoặc bằng {#limit}.',
    }),
    maxPurchasePrice: Joi.number()
        .min(Joi.ref('minPurchasePrice'))
        .messages({
            'number.base': 'Giá trị mua tối đa phải là một số.',
            'number.min': 'Giá trị mua tối đa phải lớn hơn hoặc bằng giá trị mua tối thiểu.',
        }),
    discountValue: Joi.number().min(1).messages({
        'number.base': 'Giá trị khuyến mãi phải là một số.',
        'number.min': 'Giá trị khuyến mãi phải lớn hơn hoặc bằng {#limit}.',
    }),
    description: Joi.string().trim().min(10).max(255).messages({
        'string.base': 'Mô tả khuyến mãi phải là một chuỗi văn bản.',
        'string.min': 'Mô tả khuyến mãi phải có ít nhất {#limit} ký tự.',
        'string.max': 'Mô tả khuyến mãi không được vượt quá {#limit} ký tự.',
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
    status: Joi.string().trim().valid('active', 'inactive', 'expired').messages({
        'string.base': 'Trạng thái phải là một chuỗi văn bản.',
        'string.empty': 'Trạng thái không được để trống.',
        'any.only': 'Trạng thái phải là một trong các giá trị sau: active, inactive, expired.',
    }),
    limitOnUser: Joi.boolean().messages({
        'boolean.base': 'Giới hạn sử dụng cho mỗi người dùng phải là một giá trị boolean.',
    }),
    dateStart: Joi.date().timestamp('javascript').messages({
        'date.base': 'Ngày bắt đầu phải là một ngày hợp lệ.',
    }),
    dateEnd: Joi.date().timestamp('javascript').messages({
        'date.base': 'Ngày kết thúc phải là một ngày hợp lệ.',
    }),
});
