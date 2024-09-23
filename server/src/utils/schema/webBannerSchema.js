/* eslint-disable comma-dangle */
import Joi from 'joi';
export const SAVE_WEBBANNER = Joi.object({
    title: Joi.string().trim().min(1).required().messages({
        'string.base': 'Tiêu đề phải là một chuỗi văn bản.',
        'string.empty': 'Tiêu đề không được để trống.',
        'string.min': 'Tiêu đề phải có ít nhất {#limit} ký tự.',
        'any.required': 'Tiêu đề là bắt buộc.',
    }),
    description: Joi.string().trim().min(1).required().messages({
        'string.base': 'Mô tả phải là một chuỗi văn bản.',
        'string.empty': 'Mô tả không được để trống.',
        'string.min': 'Mô tả phải có ít nhất {#limit} ký tự.',
        'any.required': 'Mô tả là bắt buộc.',
    }),
    image: Joi.string().trim().min(1).required().messages({
        'string.base': 'Hình ảnh phải là một chuỗi văn bản.',
        'string.empty': 'Hình ảnh không được để trống.',
        'string.min': 'Hình ảnh phải có ít nhất {#limit} ký tự.',
        'any.required': 'Hình ảnh là bắt buộc.',
    }),
    url: Joi.string().trim().min(1).required().messages({
        'string.base': 'Url phải là một chuỗi văn bản.',
        'string.empty': 'Url không được để trống.',
        'string.min': 'Url phải có ít nhất {#limit} ký tự.',
        'any.required': 'Url là bắt buộc.',
    }),
});

export const UPDATE_WEBBANNER = Joi.object({
    title: Joi.string().trim().min(1).messages({
        'string.base': 'Tiêu đề phải là một chuỗi văn bản.',
        'string.empty': 'Tiêu đề không được để trống.',
        'string.min': 'Tiêu đề phải có ít nhất {#limit} ký tự.',
    }),
    description: Joi.string().trim().min(1).messages({
        'string.base': 'Mô tả phải là một chuỗi văn bản.',
        'string.empty': 'Mô tả không được để trống.',
        'string.min': 'Mô tả phải có ít nhất {#limit} ký tự.',
    }),
    image: Joi.string().trim().min(1).messages({
        'string.base': 'Hình ảnh phải là một chuỗi văn bản.',
        'string.empty': 'Hình ảnh không được để trống.',
        'string.min': 'Hình ảnh phải có ít nhất {#limit} ký tự.',
    }),
    url: Joi.string().trim().min(1).messages({
        'string.base': 'Url phải là một chuỗi văn bản.',
        'string.empty': 'Url không được để trống.',
        'string.min': 'Url phải có ít nhất {#limit} ký tự.',
    }),
});
