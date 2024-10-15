import Joi from 'joi';

export const CREATE_STAFF_SCHEMA = Joi.object({
    name: Joi.string()
        .trim()
        .min(1)
        .max(30)
        .required()
        .messages({
            'string.empty': 'Tên không được để trống',
            'string.min': 'Tên phải có ít nhất 1 ký tự',
            'string.max': 'Tên không được vượt quá 30 ký tự',
            'any.required': 'Tên là bắt buộc'
        }),
    staffCode: Joi.string()
        .trim()
        .min(4)
        .max(20)
        .required()
        .messages({
            'string.empty': 'Mã nhân viên không được để trống',
            'string.min': 'Mã nhân viên phải có ít nhất 4 ký tự',
            'string.max': 'Mã nhân viên không được vượt quá 20 ký tự',
            'any.required': 'Mã nhân viên là bắt buộc'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email không được để trống',
            'string.email': 'Email không hợp lệ',
            'any.required': 'Email là bắt buộc'
        }),
    password: Joi.string()
        .trim()
        .min(1)
        .required()
        .messages({
            'string.empty': 'Mật khẩu không được để trống',
            'any.required': 'Mật khẩu là bắt buộc'
        }),
    otp: Joi.string(),
    branchId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'ID chi nhánh không hợp lệ',
            'any.required': 'ID chi nhánh là bắt buộc'
        }),
    cccd: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(9)
        .max(12)
        .default(null)
        .messages({
            'string.pattern.base': 'CCCD chỉ được chứa số',
            'string.min': 'CCCD phải có ít nhất 9 ký tự',
            'string.max': 'CCCD không được vượt quá 12 ký tự',
        }),
    bankAccount: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(10)
        .max(20)
        .default(null)
        .messages({
            'string.pattern.base': 'Số tài khoản ngân hàng chỉ được chứa số',
            'string.min': 'Số tài khoản ngân hàng phải có ít nhất 10 ký tự',
            'string.max': 'Số tài khoản ngân hàng không được vượt quá 20 ký tự',
        }),
    bankName: Joi.string().max(50).messages({
        'string.max': 'Tên ngân hàng không được vượt quá 50 ký tự'
    }),
    bankHolder: Joi.string().max(50).messages({
        'string.max': 'Chủ tài khoản không được vượt quá 50 ký tự'
    }),
    salaryType: Joi.string()
        .valid('hourly', 'monthly', 'product', 'contract')
        .default('hourly')
        .messages({
            'any.only': 'Loại lương không hợp lệ'
        }),
    salary: Joi.number().default(0),
    address: Joi.string().max(50).messages({
        'string.max': 'Địa chỉ không được vượt quá 50 ký tự'
    }),
    refreshToken: Joi.string().default(null),
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
        .valid('root', 'admin', 'staff', 'ban')
        .messages({
            'any.only': 'Vai trò không hợp lệ'
        }),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
}).messages({
    'object.unknown': 'Trường không xác định',
});
export const UPDATE_STAFF_SCHEMA = Joi.object({
    name: Joi.string()
        .trim()
        .min(1)
        .max(30)
        .messages({
            'string.empty': 'Tên không được để trống',
            'string.min': 'Tên phải có ít nhất 1 ký tự',
            'string.max': 'Tên không được vượt quá 30 ký tự',
        }),
    staffCode: Joi.string()
        .trim()
        .min(4)
        .max(20)
        .messages({
            'string.empty': 'Mã nhân viên không được để trống',
            'string.min': 'Mã nhân viên phải có ít nhất 4 ký tự',
            'string.max': 'Mã nhân viên không được vượt quá 20 ký tự',
        }),
    email: Joi.string()
        .email()
        .messages({
            'string.empty': 'Email không được để trống',
            'string.email': 'Email không hợp lệ',
        }),
    password: Joi.string()
        .trim()
        .min(1)
        .messages({
            'string.empty': 'Mật khẩu không được để trống',
        }),
    otp: Joi.string(),
    branchId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'ID chi nhánh không hợp lệ',
            'any.required': 'ID chi nhánh là bắt buộc'
        }),
    cccd: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(9)
        .max(12)
        .messages({
            'string.pattern.base': 'CCCD chỉ được chứa số',
            'string.min': 'CCCD phải có ít nhất 9 ký tự',
            'string.max': 'CCCD không được vượt quá 12 ký tự',
        }),
    bankAccount: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(10)
        .max(20)
        .messages({
            'string.pattern.base': 'Số tài khoản ngân hàng chỉ được chứa số',
            'string.min': 'Số tài khoản ngân hàng phải có ít nhất 10 ký tự',
            'string.max': 'Số tài khoản ngân hàng không được vượt quá 20 ký tự',
        }),
    bankName: Joi.string().max(50).messages({
        'string.max': 'Tên ngân hàng không được vượt quá 50 ký tự'
    }),
    bankHolder: Joi.string().max(50).messages({
        'string.max': 'Chủ tài khoản không được vượt quá 50 ký tự'
    }),
    salaryType: Joi.string()
        .valid('hourly', 'monthly', 'product', 'contract')
        .messages({
            'any.only': 'Loại lương không hợp lệ'
        }),
    salary: Joi.number().default(0),
    address: Joi.string().max(50).messages({
        'string.max': 'Địa chỉ không được vượt quá 50 ký tự'
    }),
    refreshToken: Joi.string().default(null),
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
        .valid('root', 'admin', 'staff', 'ban')
        .messages({
            'any.only': 'Vai trò không hợp lệ'
        }),
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
}).messages({
    'object.unknown': 'Trường không xác định',
});
export const UPDATE_ME_SCHEMA = Joi.object({
    name: Joi.string()
        .trim()
        .min(1)
        .max(30)
        .messages({
            'string.empty': 'Tên không được để trống',
            'string.min': 'Tên phải có ít nhất 1 ký tự',
            'string.max': 'Tên không được vượt quá 30 ký tự',
        }),
    email: Joi.string()
        .email()
        .messages({
            'string.empty': 'Email không được để trống',
            'string.email': 'Email không hợp lệ',
        }),
    password: Joi.string()
        .trim()
        .min(1)
        .messages({
            'string.empty': 'Mật khẩu không được để trống',
        }),
    otp: Joi.string(),
    cccd: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(9)
        .max(12)
        .messages({
            'string.pattern.base': 'CCCD chỉ được chứa số',
            'string.min': 'CCCD phải có ít nhất 9 ký tự',
            'string.max': 'CCCD không được vượt quá 12 ký tự',
        }),
    bankAccount: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(10)
        .max(20)
        .messages({
            'string.pattern.base': 'Số tài khoản ngân hàng chỉ được chứa số',
            'string.min': 'Số tài khoản ngân hàng phải có ít nhất 10 ký tự',
            'string.max': 'Số tài khoản ngân hàng không được vượt quá 20 ký tự',
        }),
    bankName: Joi.string().max(50).messages({
        'string.max': 'Tên ngân hàng không được vượt quá 50 ký tự'
    }),
    bankHolder: Joi.string().max(50).messages({
        'string.max': 'Chủ tài khoản không được vượt quá 50 ký tự'
    }),
    salaryType: Joi.string()
        .valid('hourly', 'monthly', 'product', 'contract')
        .messages({
            'any.only': 'Loại lương không hợp lệ'
        }),
    salary: Joi.number().default(0),
    address: Joi.string().max(50).messages({
        'string.max': 'Địa chỉ không được vượt quá 50 ký tự'
    }),
    refreshToken: Joi.string().allow(null).default(null),
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
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
}).messages({
    'object.unknown': 'Trường không xác định',
});