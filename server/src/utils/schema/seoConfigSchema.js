/* eslint-disable comma-dangle */
import Joi from 'joi';
export const SAVE_SEOCONFIG = Joi.object({
    metaTitle: Joi.string()
        .trim()
        .min(1)
        .required()
        .messages({
            'string.base': 'Tiêu đề meta phải là một chuỗi văn bản.',
            'string.empty': 'Tiêu đề meta không được để trống.',
            'string.min': 'Tiêu đề meta phải có ít nhất {#limit} ký tự.',
            'any.required': 'Tiêu đề meta là bắt buộc.',
        }),
    metaDescription: Joi.string()
        .trim()
        .min(1)
        .required()
        .messages({
            'string.base': 'Mô tả meta phải là một chuỗi văn bản.',
            'string.empty': 'Mô tả meta không được để trống.',
            'string.min': 'Mô tả meta phải có ít nhất {#limit} ký tự.',
            'any.required': 'Mô tả meta là bắt buộc.',
        }),
    // metaKeywords: Joi.array()
    //     .items(Joi.string().trim().min(1)) // Ensure each item in the array is a trimmed string
    //     .min(1)
    //     .messages({
    //         'array.base': 'Từ khóa meta phải là một mảng.',
    //         'array.min': 'Từ khóa meta phải có ít nhất {#limit} từ khóa.',
    //         'string.empty': 'Từ khóa meta không được chứa từ khóa trống.',
    //     }),
    metaKeywords: Joi.string()
        .required()
        .messages({
            'string.base': 'Từ khóa meta phải là một chuỗi văn bản.',
            'any.required': 'Từ khóa meta là bắt buộc.',
        }),
    metaRobots: Joi.string()
        .valid('index', 'noindex', 'follow', 'nofollow')
        .default('index')
        .trim()
        .not()
        .empty()
        .required()
        .messages({
            'string.base': 'Meta robots phải là một chuỗi văn bản.',
            'string.empty': 'Meta robots không được để trống.',
            'any.only': 'Meta robots phải là một trong các giá trị sau: index, noindex, follow, nofollow.',
            'any.required': 'Meta robots là bắt buộc.',
        }),
    metaOGImg: Joi.string()
        .trim()
        .min(1)
        .required()
        .messages({
            'string.base': 'Hình ảnh OG meta phải là một chuỗi văn bản.',
            'string.empty': 'Hình ảnh OG meta không được để trống.',
            'string.min': 'Hình ảnh OG meta phải có ít nhất {#limit} ký tự.',
            'any.required': 'Hình ảnh OG meta là bắt buộc.',
        }),

});

export const UPDATE_SEOCONFIG = Joi.object({
    metaTitle: Joi.string()
        .trim()
        .min(1)
        .messages({
            'string.base': 'Tiêu đề meta phải là một chuỗi văn bản.',
            'string.empty': 'Tiêu đề meta không được để trống.',
            'string.min': 'Tiêu đề meta phải có ít nhất {#limit} ký tự.',
        }),
    metaDescription: Joi.string()
        .trim()
        .min(1)
        .messages({
            'string.base': 'Mô tả meta phải là một chuỗi văn bản.',
            'string.empty': 'Mô tả meta không được để trống.',
            'string.min': 'Mô tả meta phải có ít nhất {#limit} ký tự.',
        }),
    // metaKeywords: Joi.array()
    //     .items(Joi.string().trim().min(1)) // Ensure each item in the array is a trimmed string
    //     .min(1)
    //     .messages({
    //         'array.base': 'Từ khóa meta phải là một mảng.',
    //         'array.min': 'Từ khóa meta phải có ít nhất {#limit} từ khóa.',
    //         'string.empty': 'Từ khóa meta không được chứa từ khóa trống.',
    //     }),
    metaKeywords: Joi.string()
        .messages({
            'string.base': 'Từ khóa meta phải là một chuỗi văn bản.',
        }),
    metaRobots: Joi.string()
        .valid('index', 'noindex', 'follow', 'nofollow')
        .default('index')
        .trim()
        .not()
        .empty()
        .messages({
            'string.base': 'Meta robots phải là một chuỗi văn bản.',
            'string.empty': 'Meta robots không được để trống.',
            'any.only': 'Meta robots phải là một trong các giá trị sau: index, noindex, follow, nofollow.',
        }),
    metaOGImg: Joi.string()
        .trim()
        .min(1)
        .messages({
            'string.base': 'Hình ảnh OG meta phải là một chuỗi văn bản.',
            'string.empty': 'Hình ảnh OG meta không được để trống.',
            'string.min': 'Hình ảnh OG meta phải có ít nhất {#limit} ký tự.',
        }),
});