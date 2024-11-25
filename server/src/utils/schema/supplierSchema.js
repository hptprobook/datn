import Joi from 'joi';

// Schema con dùng chung
const requiredString = (fieldName) =>
  Joi.string().required().messages({
    'string.base': `${fieldName} không hợp lệ.`,
    'any.required': `${fieldName} là bắt buộc.`,
  });

const optionalString = (fieldName) =>
  Joi.string().optional().allow(null).messages({
    'string.empty': `${fieldName} không được để trống.`,
    'string.base': `${fieldName} không đúng định dạng.`,
  });

const phoneSchema = Joi.string()
  .pattern(/^[0-9]+$/)
  .min(10)
  .max(15)
  .required()
  .messages({
    'string.pattern.base': 'Số điện thoại chỉ chứa số.',
    'string.min': 'Số điện thoại phải có ít nhất 10 ký tự.',
    'string.max': 'Số điện thoại không được vượt quá 15 ký tự.',
    'any.required': 'Số điện thoại là bắt buộc.',
  });

const emailSchema = Joi.string()
  .email()
  .required()
  .messages({
    'string.base': 'Địa chỉ email không hợp lệ.',
    'string.email': 'Địa chỉ email không hợp lệ.',
    'any.required': 'Email là bắt buộc.',
  });

const websiteSchema = Joi.string()
  .uri()
  .allow(null)
  .messages({
    'string.uri': 'Địa chỉ website không hợp lệ.',
  });

const ratingSchema = Joi.number()
  .min(0)
  .max(5)
  .optional()
  .messages({
    'number.min': 'Đánh giá tối thiểu là 0.',
    'number.max': 'Đánh giá tối đa là 5.',
  });

// Schema CREATE
export const SAVE_SUPPLIER_SCHEMA = Joi.object({
  companyName: requiredString('Tên công ty'),
  fullName: requiredString('Tên đầy đủ'),
  phone: phoneSchema,
  email: emailSchema,
  address: requiredString('Địa chỉ'),
  registrationNumber: optionalString('Số đăng ký kinh doanh'),
  website: websiteSchema,
  productsSupplied: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Danh sách sản phẩm cung cấp phải là một mảng.',
  }),
  rating: ratingSchema,
  notes: optionalString('Ghi chú'),
  createdAt: Joi.date().default(() => new Date()).messages({
    'date.base': 'Ngày tạo không hợp lệ.',
  }),
});

// Schema UPDATE
export const UPDATE_SUPPLIER = Joi.object({
  companyName: requiredString('Tên công ty'),
  fullName: requiredString('Tên đầy đủ'),
  phone: phoneSchema,
  email: emailSchema,
  address: requiredString('Địa chỉ'),
  registrationNumber: optionalString('Số đăng ký kinh doanh'),
  website: websiteSchema,
  productsSupplied: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Danh sách sản phẩm cung cấp phải là một mảng.',
  }),
  rating: ratingSchema,
  notes: optionalString('Ghi chú'),
});
