import Joi from 'joi';

export const SAVE_CATEGORY_SCHEMA = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Tên không được để trống',
    'any.required': 'Tên là bắt buộc',
  }),
  slug: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Slug không được để trống',
    'any.required': 'Slug là bắt buộc',
  }),
  description: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Mô tả ngắn không được để trống',
    'any.required': 'Mô tả ngắn là bắt buộc',
  }),
  imageURL: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Ảnh không được để trống',
    'any.required': 'Ảnh là bắt buộc',
  }),
  parentId: Joi.string().trim().min(1).allow(null).required().messages({
    'string.empty': 'Danh mục không được để trống',
    'any.required': 'Danh mục là bắt buộc',
  }),
  status: Joi.boolean().required().messages({
    'any.required': 'Trạng thái danh mục là bắt buộc',
  }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_CATEGORY = Joi.object({
  name: Joi.string().trim().min(1).messages({
    'string.empty': 'Tên không được để trống',
  }),
  slug: Joi.string().trim().min(1).messages({
    'string.empty': 'Slug không được để trống',
  }),
  description: Joi.string().trim().min(1).messages({
    'string.empty': 'Mô tả ngắn không được để trống',
  }),
  content: Joi.string().trim().min(1).messages({
    'string.empty': 'Mô tả không được để trống',
  }),
  imageURL: Joi.string().trim().min(1).messages({
    'string.empty': 'Ảnh không được để trống',
  }),
  parentId: Joi.string().trim().min(1).allow(null).messages({
    'string.empty': 'Danh mục không được để trống',
  }),
  status: Joi.boolean(),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
