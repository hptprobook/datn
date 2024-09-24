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
  category: Joi.string().trim().min(1).messages({
    'string.empty': 'Danh mục không được để trống',
  }).default('Quần áo'),
  description: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Nội dung không được để trống',
    'any.required': 'Nội dung là bắt buộc',
  }),
  website: Joi.string().trim().min(1).uri().messages({
    'string.uri': 'Website không hợp lệ',
  }),
  image: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Ảnh không được để trống',
    'any.required': 'Ảnh là bắt buộc',
  }),
  status: Joi.boolean().default(true).messages({
    'boolean.base': 'Trạng thái phải là Đúng/Sai',
  }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_BRAND = Joi.object({
  name: Joi.string().trim().min(1).messages({
    'string.empty': 'Tên không được để trống',
  }),
  category: Joi.string().trim().min(1).messages({
    'string.empty': 'Danh mục không được để trống',
  }),
  slug: Joi.string().trim().min(1).messages({
    'string.empty': 'Slug không được để trống',
  }),
  description: Joi.string().trim().min(1).messages({
    'string.empty': 'Nội dung không được để trống',
  }),
  image: Joi.string().trim().min(1).messages({
    'string.empty': 'Ảnh không được để trống',
  }),
  website: Joi.string().trim().min(1).uri().messages({
    'string.uri': 'Website không hợp lệ',
  }),
  status: Joi.boolean(),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
