import Joi from 'joi';
// import { ObjectId } from 'mongodb';
const baseSchema = Joi.object({
  staffId: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Id người dùng không được để trống',
    'any.required': 'Id người dùng là bắt buộc',
  }),
  code: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Mã hàng hóa đơn hàng không được để trống',
    'any.required': 'Mã hàng hóa đơn hàng là bắt buộc',
  }),
  productsList: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().trim().allow(null),
        quantity: Joi.number().integer().required().messages({
          'string.empty': 'Tồn kho không được để trống',
          'any.required': 'Tồn kho là bắt buộc',
        }),
        image: Joi.string().trim().min(1).required().messages({
          'string.empty': 'Ảnh không được để trống',
          'any.required': 'Ảnh là bắt buộc',
        }),
        sku: Joi.string().trim().min(1).required().messages({
          'string.empty': 'SKU không được để trống',
          'any.required': 'SKU là bắt buộc',
        }),
        name: Joi.string().trim().min(1).required().messages({
          'string.empty': 'Tên không được để trống',
          'any.required': 'Tên là bắt buộc',
        }),
        price: Joi.number().precision(2).min(1).required().messages({
          'string.empty': 'Giá không được để trống',
          'any.required': 'Giá là bắt buộc',
        }),
        discount: Joi.number().precision(2).min(0).default(0).messages({
          'number.base': 'Số tiền giảm phải là một số',
        }),
        size: Joi.string().trim().min(1).required().messages({
          'string.empty': 'Biến thể kích thước không được để trống',
          'any.required': 'Biến thể kích thước là bắt buộc',
        }),
        itemTotal: Joi.number().precision(2).min(1).required().messages({
          'string.empty': 'Giá tổng không được để trống',
          'any.required': 'Giá tổng là bắt buộc',
        }),
        status: Joi.valid('Chưa xác nhận', 'Đã xác nhận', 'Lỗi').default(
          'Chưa xác nhận'
        ),
        note: Joi.string().trim().allow(null).default('Không có ghi chú').messages({
          'string.base': 'Ghi chú phải là một chuỗi',
        }),
      })
    )
    .required()
    .messages({
      'any.required': 'Danh sách sản phẩm là bắt buộc',
    }),
  statusPayment: Joi.valid('Chưa thanh toán', 'Đã thanh toán', 'Trả góp').default(
    'Chưa thanh toán'
  ),
  warehouseId: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Id nhà kho không được để trống',
    'any.required': 'Id nhà kho là bắt buộc',
  }),
  discount: Joi.number().precision(2).min(0).default(0).messages({
    'number.base': 'Số tiền phải là một số',
  }),
  supplierId: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Id nhà cung cấp không được để trống',
    'any.required': 'Id nhà cung cấp là bắt buộc',
  }),
  amountPaid: Joi.number().precision(2).min(0).default(0)
    .messages({
      'number.base': 'Số tiền phải là một số',
    }),
  totalPrice: Joi.number().precision(2).min(1).required().messages({
    'string.empty': 'Giá tổng không được để trống',
    'any.required': 'Giá tổng là bắt buộc',
  }),
  paymentMethod: Joi.valid('Tiền mặt', 'Chuyển khoản', 'VNPAY').default(
    'Tiền mặt'
  ),
  note: Joi.string().trim().allow(null).default('Không có ghi chú').messages({
    'string.base': 'Ghi chú phải là một chuỗi',
  }),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const SAVE_GOODS_ORDERS = baseSchema;

export const UPDATE_GOODS_ORDERS = baseSchema.fork(
  ['staffId', 'code', 'productsList', 'warehouseId', 'supplierId', 'totalPrice'],
  (schema) => schema.optional()
).append({
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});