import Joi from 'joi';
export const SAVE_RECEIPT_SCHEMA = Joi.object({
  orderId: Joi.string().trim().allow(null).messages({
    'string.base': 'orderID hàng bắt buộc phải là chuỗi',
  }),
  recieptCode: Joi.string().trim().messages({
    'string.base': 'Mã hóa đơn bắt buộc phải là chuỗi',
  }),
  name: Joi.string().trim().default('Người mua hàng').messages({
    'string.empty': 'Tên không được để trống',
  }),
  phone: Joi.string().trim().default(null),
  status: Joi.string().trim().valid('success', 'returned').default('success'),
  total: Joi.number().required().messages({
    'number.base': 'Tổng tiền bắt buộc phải là số',
  }),
  amount_paid_by: Joi.number().required().default(0).messages({
    'number.base': 'Số tiền khách trả bắt buộc phải là số',
  }),
  amount_paid_to: Joi.number().default(0).messages({
    'number.base': 'Số tiền trả khách bắt buộc phải là số',
  }),
  discount: Joi.number().default(0).messages({
    'number.base': 'Giảm giá bắt buộc phải là số',
  }),
  paymentMethod: Joi.valid('Tiền mặt', 'Chuyển khoản', 'VNPAY').default(
    'Tiền mặt'
  ),
  type: Joi.string()
    .trim()
    .valid('online', 'store', 'tiktok', 'facebook', 'zalo')
    .default('store')
    .messages({
      'string.base': 'Loại hóa đơn bắt buộc phải là chuỗi',
    }),
  note: Joi.string().trim().default('Mua sản phẩm tại cửa hàng'),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_RECEIPT_SCHEMA = Joi.object({
  name: Joi.string().trim().min(1).messages({
    'string.empty': 'Tên không được để trống',
  }),
  phone: Joi.string().trim().min(1),
  status: Joi.string().trim().valid('success', 'returned'),
  total: Joi.number().messages({
    'number.base': 'Tổng tiền bắt buộc phải là số',
  }),
  amount_paid_by: Joi.number().messages({
    'number.base': 'Số tiền khách trả bắt buộc phải là số',
  }),
  amount_paid_to: Joi.number().messages({
    'number.base': 'Số tiền trả khách bắt buộc phải là số',
  }),
  discount: Joi.number().messages({
    'number.base': 'Giảm giá bắt buộc phải là số',
  }),
  paymentMethod: Joi.valid('Tiền mặt', 'Chuyển khoản', 'VNPAY'),
  type: Joi.string()
    .trim()
    .valid('online', 'store', 'tiktok', 'facebook', 'zalo')
    .messages({
      'string.base': 'Loại hóa đơn bắt buộc phải là chuỗi',
    }),
  note: Joi.string().trim(),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
