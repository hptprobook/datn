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
  order: Joi.number().integer().required().valid(0, 1, 2).messages({
    'any.required': 'Thứ tự là bắt buộc',
    'number.base': 'Thứ tự phải là số',
    'number.integer': 'Thứ tự phải là số nguyên',
    'any.only': 'Thứ tự không hợp lệ',
  }),
  imageURL: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Ảnh không được để trống',
    'any.required': 'Ảnh là bắt buộc',
  }),
  parentId: Joi.string().trim().min(1).allow(null).required().messages({
    'string.empty': 'Danh mục không được để trống',
    'any.required': 'Danh mục là bắt buộc',
  }),
  status: Joi.string()
    .valid('Ẩn', 'Hiện')
    .required()
    .messages({
      'any.required': 'Trạng thái danh mục là bắt buộc',
      'any.only': 'Trạng thái danh mục chỉ có thể là "Ẩn" hoặc "Hiện"',
    }),
  seoOption: Joi.object({
    title: Joi.string().trim().min(1).max(70).required().messages({
      'string.empty': 'Tiêu đề không được để trống',
      'string.min': 'Tiêu đề phải có ít nhất 1 ký tự',
      'string.max': 'Tiêu đề tối đa 70 ký tự',
      'any.required': 'Tiêu đề là bắt buộc',
    }),
    description: Joi.string().trim().min(1).max(320).required().messages({
      'string.empty': 'Mô tả không được để trống',
      'string.min': 'Mô tả phải có ít nhất 1 ký tự',
      'string.max': 'Mô tả tối đa 320 ký tự',
      'any.required': 'Mô tả là bắt buộc',
    }),
    alias: Joi.string().trim().min(1).required().messages({
      'string.empty': 'Đường dẫn không được để trống',
      'string.min': 'Đường dẫn phải có ít nhất 1 ký tự',
      'any.required': 'Đường dẫn là bắt buộc',
    }),
  })
    .required()
    .messages({
      'any.required': 'SEO là bắt buộc',
    }),
  views: Joi.number().integer().default(0),
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
  imageURL: Joi.string().trim().min(1).messages({
    'string.empty': 'Ảnh không được để trống',
  }),
  parentId: Joi.string().trim().min(1).allow(null).messages({
    'string.empty': 'Danh mục không được để trống',
  }),
  order: Joi.number().integer().valid(0, 1, 2).messages({
    'number.base': 'Thứ tự phải là số',
    'number.integer': 'Thứ tự phải là số nguyên',
    'any.only': 'Thứ tự không hợp lệ',
  }),
  views: Joi.number().integer(),
  status: Joi.string().valid('Ẩn', 'Hiện').messages({
    'any.only': 'Trạng thái danh mục chỉ có thể là "Ẩn" hoặc "Hiện"',
  }),
  seoOption: Joi.object({
    title: Joi.string().trim().min(1).max(70).messages({
      'string.empty': 'Tiêu đề không được để trống',
      'string.min': 'Tiêu đề phải có ít nhất 1 ký tự',
      'string.max': 'Tiêu đề tối đa 70 ký tự',
    }),
    description: Joi.string().trim().min(1).max(320).messages({
      'string.empty': 'Mô tả không được để trống',
      'string.min': 'Mô tả phải có ít nhất 1 ký tự',
      'string.max': 'Mô tả tối đa 320 ký tự',
    }),
    alias: Joi.string().trim().min(1).messages({
      'string.empty': 'Đường dẫn không được để trống',
      'string.min': 'Đường dẫn phải có ít nhất 1 ký tự',
    }),
  }),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
