import Joi from 'joi';

export const SAVE_RECEIPT_SCHEMA = Joi.object({
  staffId: Joi.string().trim().allow(null).messages({
    'string.base': 'Người bán hàng bắt buộc phải là chuỗi',
  }),
  orderId: Joi.string().trim().allow(null).messages({
    'string.base': 'orderID hàng bắt buộc phải là chuỗi',
  }),
  receiptCode: Joi.string().trim().messages({
    'string.base': 'Mã hóa đơn bắt buộc phải là chuỗi',
  }),
  name: Joi.string().trim().min(1).default('Người mua hàng').messages({
    'string.empty': 'Tên không được để trống',
  }),
  phone: Joi.string().allow(null).trim().min(1),
  status: Joi.string().trim().valid('success', 'returned').default('success'),
  total: Joi.number().required().messages({
    'number.base': 'Tổng tiền bắt buộc phải là số',
  }),
  productsList: Joi.array().items(
    Joi.object({
      _id: Joi.string().trim().min(1).allow(null),
      quantity: Joi.number().integer().min(1).required(),
      image: Joi.string().trim().min(1).allow(null),
      name: Joi.string().trim().min(1).required(),
      price: Joi.number().min(1).required(),
      variantColor: Joi.string().trim().min(1).allow(null),
      variantSize: Joi.string().trim().min(1).allow(null),
      sku: Joi.string().trim().min(1).allow(null),
      weight: Joi.number().min(1).allow(null),
    })
  ),
  amountPaidBy: Joi.number().required().default(0).messages({
    'number.base': 'Số tiền khách trả bắt buộc phải là số',
  }),
  amountPaidTo: Joi.number().default(0).messages({
    'number.base': 'Số tiền trả khách bắt buộc phải là số',
  }),
  discount: Joi.number().default(0).messages({
    'number.base': 'Giảm giá bắt buộc phải là số',
  }),
  discountCode: Joi.string().trim().allow(null),
  paymentMethod: Joi.valid('Tiền mặt', 'Chuyển khoản', 'VNPAY').default(
    'Tiền mặt'
  ),
  type: Joi.string()
    .trim()
    .valid('online', 'store', 'tiktok', 'facebook', 'zalo', 'return')
    .default('store')
    .messages({
      'string.base': 'Loại hóa đơn bắt buộc phải là chuỗi',
    }),
  note: Joi.string().trim().default('Mua sản phẩm tại cửa hàng'),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_RECEIPT_SCHEMA = Joi.object({
  name: Joi.string().trim().min(1).default('Người mua hàng').messages({
    'string.empty': 'Tên không được để trống',
  }),
  phone: Joi.string().trim().min(1),
  status: Joi.string().trim().valid('success', 'returned'),
  total: Joi.number().min(1).messages({
    'number.base': 'Tổng tiền bắt buộc phải là số',
  }),
  productsList: Joi.array().items(
    Joi.object({
      _id: Joi.string().trim().min(1).allow(null),
      quantity: Joi.number().integer().min(1).required(),
      image: Joi.string().trim().min(1).allow(null),
      name: Joi.string().trim().min(1).required(),
      price: Joi.number().min(1).required(),
      variantColor: Joi.string().trim().min(1).allow(null),
      variantSize: Joi.string().trim().min(1).allow(null),
      sku: Joi.string().trim().min(1).allow(null),
      weight: Joi.number().min(1).allow(null),
    })
  ),
  amountPaidBy: Joi.number().required().messages({
    'number.base': 'Số tiền khách trả bắt buộc phải là số',
  }),
  amountPaidTo: Joi.number().messages({
    'number.base': 'Số tiền trả khách bắt buộc phải là số',
  }),
  discount: Joi.number().messages({
    'number.base': 'Giảm giá bắt buộc phải là số',
  }),
  discountCode: Joi.string().trim().allow(null),
  paymentMethod: Joi.valid('Tiền mặt', 'Chuyển khoản', 'VNPAY'),
  type: Joi.string()
    .trim()
    .valid('online', 'store', 'tiktok', 'facebook', 'zalo', 'return')
    .messages({
      'string.base': 'Loại hóa đơn bắt buộc phải là chuỗi',
    }),
  note: Joi.string().trim(),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
