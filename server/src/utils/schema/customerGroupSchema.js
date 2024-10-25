/* eslint-disable comma-dangle */
import Joi from 'joi';
export const SAVE_CUSTOMER_GROUP = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.base': 'Tên nhóm khách hàng phải là một chuỗi văn bản.',
        'string.empty': 'Tên nhóm khách hàng không được để trống.',
        'any.required': 'Tên nhóm khách hàng là bắt buộc.',
    }),
    note: Joi.string().trim().messages({
        'string.base': 'Ghi chú phải là một chuỗi văn bản.',
        'string.empty': 'Ghi chú không được để trống.',
    }),
    manual: Joi.boolean().default(false),
    satisfy: Joi.string()
        .trim()
        .valid('all', 'once', 'manual')
        .messages({
            'string.base': 'Thỏa mãn điều kiện phải là một chuỗi.',
            'any.only':
                'Thỏa mãn điều kiện chỉ có thể là "tất cả", "một trong các điều kiện", "thủ công"',
        })
        .default('manual'),
    auto: Joi.when('manual', {
        is: false,
        then: Joi.array().items(
            Joi.object({
                id: Joi.string().trim(),
                field: Joi.string().required().messages({
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
        ).default([]),
        otherwise: Joi.array().default([]),
    }),
    // Khách hàng phải thỏa mãn điều kiện của tự động (auto)

    listCustomer: Joi.array().default([]),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_CUSTOMER_GROUP = Joi.object({
    name: Joi.string().trim().messages({
        'string.base': 'Tên nhóm khách hàng phải là một chuỗi văn bản.',
        'string.empty': 'Tên nhóm khách hàng không được để trống.',
    }),
    note: Joi.string().trim().messages({
        'string.base': 'Ghi chú phải là một chuỗi văn bản.',
        'string.empty': 'Ghi chú không được để trống.',
    }),
    manual: Joi.boolean().messages({
        'boolean.base': 'Trạng thái hợp lệ "true" hoặc "false',
    }),
    satisfy: Joi.string().trim().valid('all', 'once', 'manual').messages({
        'string.base': 'Thỏa mãn điều kiện phải là một chuỗi.',
        'any.only':
            'Thỏa mãn điều kiện chỉ có thể là "tất cả", "một trong các điều kiện", "thủ công"',
    }),
    auto: Joi.array().items(
        Joi.object({
            id: Joi.string().trim(),
            field: Joi.string().required().messages({
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
    // listCustomer: Joi.array().default([]),
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_USER_CUSTOMER_GROUP = Joi.array().items(
    Joi.object({
        id: Joi.string().trim().required().messages({
            'any.required': 'id là bắt buộc.',
        }),
        name: Joi.string().required().messages({
            'any.required': 'Tên đầy đủ là bắt buộc.',
        }),
        phone: Joi.string()
            .pattern(/^[0-9]+$/)
            .min(10)
            .max(15)
            .required()
            .messages({
                'string.pattern.base': 'Số điện thoại chỉ chứa số.',
                'string.min': 'Số điện thoại phải có ít nhất 10 ký tự.',
                'string.max': 'Số điện thoại không được vượt quá 15 ký tự.',
                'any.required': 'Số điện thoại là bắt buộc.',
            }),
        email: Joi.string().email().required().messages({
            'string.email': 'Địa chỉ email không hợp lệ.',
            'any.required': 'Email là bắt buộc.',
        }),
    })
);
