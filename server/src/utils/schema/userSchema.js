import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../validators';

export const SAVE_USER_SCHEMA = Joi.object({
  name: Joi.string().trim().min(1).max(30).required().messages({
    'string.empty': 'Tên không được để trống',
    'string.min': 'Tên phải có ít nhất 1 ký tự',
    'string.max': 'Tên không được vượt quá 30 ký tự',
    'any.required': 'Tên là bắt buộc',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc',
  }),
  password: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu là bắt buộc',
  }),
  otp: Joi.string(),
  addresses: Joi.array().items(
    Joi.object({
      name: Joi.string().max(50).messages({
        'string.max': 'Tên địa chỉ không được vượt quá 50 ký tự',
      }),
      phone: Joi.string().max(50).messages({
        'string.max': 'Số điện thoại không được vượt quá 50 ký tự',
      }),
      province_id: Joi.number().integer(),
      district_id: Joi.number().integer(),
      ward_id: Joi.number().integer(),
      address: Joi.string(),
      isDefault: Joi.boolean().default(false),
      note: Joi.string(),
    })
  ),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .default(null)
    .messages({
      'string.pattern.base': 'Số điện thoại chỉ được chứa số',
      'string.min': 'Số điện thoại phải có ít nhất 10 ký tự',
      'string.max': 'Số điện thoại không được vượt quá 15 ký tự',
    }),
  role: Joi.string()
    .valid('root', 'admin', 'staff', 'user', 'ban')
    .default('user')
    .messages({
      'any.only': 'Vai trò không hợp lệ',
    }),
  allowNotifies: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
}).messages({
  'object.unknown': 'Trường không xác định',
});

export const UPDATE_USER = Joi.object({
  name: Joi.string().trim().min(1).max(30).required().messages({
    'string.empty': 'Tên không được để trống',
    'string.min': 'Tên phải có ít nhất 1 ký tự',
    'string.max': 'Tên không được vượt quá 30 ký tự',
    'any.required': 'Tên là bắt buộc',
  }),
  password: Joi.string(),
  otp: Joi.string(),
  addresses: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE),
        name: Joi.string().max(50).messages({
          'string.max': 'Tên địa chỉ không được vượt quá 50 ký tự',
        }),
        phone: Joi.string().max(50).messages({
          'string.max': 'Số điện thoại không được vượt quá 50 ký tự',
        }),
        email: Joi.string().email(),
        province_id: Joi.number().integer(),
        district_id: Joi.number().integer(),
        ward_id: Joi.string(),
        address: Joi.string(),
        isDefault: Joi.boolean().default(false),
        note: Joi.string(),
      })
    )
    .default([]),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .default(null)
    .messages({
      'string.pattern.base': 'Số điện thoại chỉ được chứa số',
      'string.min': 'Số điện thoại phải có ít nhất 10 ký tự',
      'string.max': 'Số điện thoại không được vượt quá 15 ký tự',
    }),
  role: Joi.string()
    .valid('root', 'admin', 'staff', 'user', 'ban')
    .default('user')
    .messages({
      'any.only': 'Vai trò không hợp lệ',
    }),
  allowNotifies: Joi.boolean().default(false),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
}).messages({
  'object.unknown': 'Trường không xác định',
});

export const FAVORITE_PRODUCT = Joi.array().items(
  Joi.string().trim().min(1).required().messages({
    'string.empty': 'Sản phẩm không được để trống',
    'any.required': 'Sản phẩm là bắt buộc',
  })
);

export const VIEW_PRODUCT = Joi.array().items(
  Joi.string().trim().min(1).required().messages({
    'string.empty': 'Sản phẩm không được để trống',
    'any.required': 'Sản phẩm là bắt buộc',
  })
);
