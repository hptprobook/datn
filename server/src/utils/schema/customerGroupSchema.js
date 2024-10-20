/* eslint-disable comma-dangle */
import Joi from 'joi';
export const SAVE_CUSTOMER_GROUP = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.base': 'Tên nhóm khách hàng phải là một chuỗi văn bản.',
        'string.empty': 'Tên nhóm khách hàng không được để trống.',
        'any.required': 'Tên nhóm khách hàng là bắt buộc.',
    }),
    note: Joi.string().trim().required().messages({
        'string.base': 'Ghi chú phải là một chuỗi văn bản.',
        'string.empty': 'Ghi chú không được để trống.',
        'any.required': 'Ghi chú là bắt buộc.',
    }),
    manual: Joi.boolean().default(false),
    auto: Joi.array()
        .items(
            Joi.object({
                id: Joi.string().trim().required(),
                field: Joi.number().integer().required().messages({
                    'string.base': 'Trường phải là một chuỗi văn bản.',
                    'string.empty': 'Trường không được để trống.',
                    'any.required': 'Trường là bắt buộc.',
                }),
                query: Joi.string().trim().required().messages({
                    'string.base': 'Điều kiện phải là một chuỗi văn bản.',
                    'string.empty': 'Điều kiện không được để trống.',
                    'any.required': 'Điều kiện là bắt buộc.',
                }),
                status: Joi.string().trim().required().messages({
                    'string.base': 'Giá trị phải là một chuỗi văn bản.',
                    'string.empty': 'Giá trị không được để trống.',
                    'any.required': 'Giá trị là bắt buộc.',
                }),
            })
        )
        .default([]),
    // Khách hàng phải thỏa mãn điều kiện của tự động (auto)
    satisfy: Joi.string()
        .trim()
        .valid('all', 'once', 'manual')
        .messages({
            'string.base': 'Thỏa mãn điều kiện phải là một chuỗi.',
            'any.only':
                'Thỏa mãn điều kiện chỉ có thể là "tất cả", "một trong các điều kiện", "thủ công"',
        })
        .default('manual'),
    listCustomer: Joi.array().default([]),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_CUSTOMER_GROUP = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.base': 'Tên nhóm khách hàng phải là một chuỗi văn bản.',
        'string.empty': 'Tên nhóm khách hàng không được để trống.',
        'any.required': 'Tên nhóm khách hàng là bắt buộc.',
    }),
    note: Joi.string().trim().required().messages({
        'string.base': 'Ghi chú phải là một chuỗi văn bản.',
        'string.empty': 'Ghi chú không được để trống.',
        'any.required': 'Ghi chú là bắt buộc.',
    }),
    manual: Joi.boolean().default(false),
    auto: Joi.array().items(
        Joi.object({
            id: Joi.string().trim().required(),
            field: Joi.number().integer().required().messages({
                'string.base': 'Trường phải là một chuỗi văn bản.',
                'string.empty': 'Trường không được để trống.',
                'any.required': 'Trường là bắt buộc.',
            }),
            query: Joi.string().trim().required().messages({
                'string.base': 'Điều kiện phải là một chuỗi văn bản.',
                'string.empty': 'Điều kiện không được để trống.',
                'any.required': 'Điều kiện là bắt buộc.',
            }),
            status: Joi.string().trim().required().messages({
                'string.base': 'Giá trị phải là một chuỗi văn bản.',
                'string.empty': 'Giá trị không được để trống.',
                'any.required': 'Giá trị là bắt buộc.',
            }),
        })
    ),
    // Khách hàng phải thỏa mãn điều kiện của tự động (auto)
    satisfy: Joi.string().trim().valid('all', 'once').messages({
        'string.base': 'Thỏa mãn điều kiện phải là một chuỗi.',
        'any.only':
            'Thỏa mãn điều kiện chỉ có thể là "tất cả" hoặc "một trong các điều kiện"',
    }),
    listCustomer: Joi.array().items(
        Joi.object({
            id: Joi.string().trim().required(),
            field: Joi.number().integer().required().messages({
                'string.base': 'Trường phải là một chuỗi văn bản.',
                'string.empty': 'Trường không được để trống.',
                'any.required': 'Trường là bắt buộc.',
            }),
            query: Joi.string().trim().required().messages({
                'string.base': 'Điều kiện phải là một chuỗi văn bản.',
                'string.empty': 'Điều kiện không được để trống.',
                'any.required': 'Điều kiện là bắt buộc.',
            }),
            status: Joi.string().trim().required().messages({
                'string.base': 'Giá trị phải là một chuỗi văn bản.',
                'string.empty': 'Giá trị không được để trống.',
                'any.required': 'Giá trị là bắt buộc.',
            }),
        })
    ),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
