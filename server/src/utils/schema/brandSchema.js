import Joi from 'joi';

export const SAVE_BRAND = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Tên không được để trống',
    'any.required': 'Tên là bắt buộc',
  }),
  slug: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Slug không được để trống',
    'any.required': 'Slug là bắt buộc',
  }),
  content: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Nội dung không được để trống',
    'any.required': 'Nội dung là bắt buộc',
  }),
  image: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Ảnh không được để trống',
    'any.required': 'Ảnh là bắt buộc',
  }),
  status: Joi.boolean().required().messages({
    'any.required': 'Trạng thái là bắt buộc',
  }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_BRAND = Joi.object({
  name: Joi.string().trim().min(1).messages({
    'string.empty': 'Tên không được để trống',
  }),
  slug: Joi.string().trim().min(1).messages({
    'string.empty': 'Slug không được để trống',
  }),
  content: Joi.string().trim().min(1).messages({
    'string.empty': 'Nội dung không được để trống',
  }),
  image: Joi.string().trim().min(1).messages({
    'string.empty': 'Ảnh không được để trống',
  }),
  status: Joi.boolean(),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
