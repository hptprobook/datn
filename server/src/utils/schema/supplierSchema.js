import Joi from 'joi';

export const SAVE_SUPPLIER_SCHEMA = Joi.object({
  companyName: Joi.string().required().messages({
    'any.required': 'Tên công ty là bắt buộc.'
  }),
  fullName: Joi.string().required().messages({
    'any.required': 'Tên đầy đủ là bắt buộc.'
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
      'any.required': 'Số điện thoại là bắt buộc.'
    }),
  email: Joi.string().email().required().messages({
    'string.email': 'Địa chỉ email không hợp lệ.',
    'any.required': 'Email là bắt buộc.'
  }),
  address: Joi.string().required().messages({
    'any.required': 'Địa chỉ là bắt buộc.'
  }),
  registrationNumber: Joi.string().optional().messages({
    'string.empty': 'Số đăng ký kinh doanh không được để trống.'
  }),
  website: Joi.string().uri().optional().messages({
    'string.uri': 'Địa chỉ website không hợp lệ.'
  }),
  productsSupplied: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Danh sách sản phẩm cung cấp phải là một mảng.'
  }),
  rating: Joi.number().min(0).max(5).optional().messages({
    'number.min': 'Đánh giá tối thiểu là 0.',
    'number.max': 'Đánh giá tối đa là 5.'
  }),
  notes: Joi.string().optional().messages({
    'string.empty': 'Ghi chú không được để trống.'
  }),
});

export const UPDATE_SUPPLIER = Joi.object({
  companyName: Joi.string().required().messages({
    'any.required': 'Tên công ty là bắt buộc.'
  }),
  fullName: Joi.string().required().messages({
    'any.required': 'Tên đầy đủ là bắt buộc.'
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
      'any.required': 'Số điện thoại là bắt buộc.'
    }),
  email: Joi.string().email().required().messages({
    'string.email': 'Địa chỉ email không hợp lệ.',
    'any.required': 'Email là bắt buộc.'
  }),
  address: Joi.string().required().messages({
    'any.required': 'Địa chỉ là bắt buộc.'
  }),
  registrationNumber: Joi.string().optional().messages({
    'string.empty': 'Số đăng ký kinh doanh không được để trống.'
  }),
  website: Joi.string().uri().optional().messages({
    'string.uri': 'Địa chỉ website không hợp lệ.'
  }),
  productsSupplied: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Danh sách sản phẩm cung cấp phải là một mảng.'
  }),
  rating: Joi.number().min(0).max(5).optional().messages({
    'number.min': 'Đánh giá tối thiểu là 0.',
    'number.max': 'Đánh giá tối đa là 5.'
  }),
  notes: Joi.string().optional().messages({
    'string.empty': 'Ghi chú không được để trống.'
  }),
});
