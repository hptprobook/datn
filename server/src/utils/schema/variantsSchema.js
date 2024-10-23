import Joi from 'joi';

export const SAVE_VARIANT = Joi.object({
  name: Joi.string().trim().empty().min(1).required().messages({
    'string.empty': 'Tên không được để trống',
    'any.required': 'Tên là bắt buộc',
  }),
  type: Joi.string()
    .valid('size', 'color')
    .trim()
    .not()
    .empty()
    .required()
    .messages({
      'string.base': 'Loại phải là một chuỗi văn bản.',
      'string.empty': 'Loại không được để trống.',
      'any.only': 'Loại phải là một trong các giá trị sau: color, size.',
      'any.required': 'Loại là bắt buộc.',
    }),
  value: Joi.string().trim().empty().min(1).max(10).required().messages({
    'string.empty': 'Giá trị không được để trống.',
    'string.max': 'Giá trị không được quá 10 ký tự',
    'string.min': 'Giá trị không được quá 1 ký tự',
    'any.required': 'Giá trị là bắt buộc.',
  }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_VARIANT = Joi.object({
  name: Joi.string().trim().empty().min(1).messages({
    'string.empty': 'Tên không được để trống',
  }),
  type: Joi.string().valid('size', 'color').trim().not().empty().messages({
    'string.base': 'Loại phải là một chuỗi văn bản.',
    'string.empty': 'Loại không được để trống.',
    'any.only': 'Loại phải là một trong các giá trị sau: color, size.',
  }),
  value: Joi.string().trim().empty().min(1).max(10).messages({
    'string.empty': 'Giá trị không được để trống.',
    'string.max': 'Giá trị không được quá 10 ký tự',
    'string.min': 'Giá trị không được quá 1 ký tự',
  }),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
