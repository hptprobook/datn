import Joi from 'joi';
// import { ObjectId } from 'mongodb';

const OrderStatus = {
  pending: 'pending',
  processing: 'processing',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
  refund: 'refund',
  returned: 'returned',
  completed: 'completed',
};

export const SAVE_GOODS_ORDERS = Joi.object({
  userId: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Id người dùng không được để trống',
    'any.required': 'Id người dùng là bắt buộc',
  }),
  goodsOrderCode: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Mã hàng hóa đơn hàng không được để trống',
    'any.required': 'Mã hàng hóa đơn hàng là bắt buộc',
  }),
  productsList: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().trim().min(1).required().messages({
          'string.empty': 'Id sản phẩm không được để trống',
          'any.required': 'Id sản phẩm là bắt buộc',
        }),
        quantity: Joi.number().integer().required().messages({
          'string.empty': 'Tồn kho không được để trống',
          'any.required': 'Tồn kho là bắt buộc',
        }),
        image: Joi.string().trim().min(1).required().messages({
          'string.empty': 'Ảnh không được để trống',
          'any.required': 'Ảnh là bắt buộc',
        }),
        name: Joi.string().trim().min(1).required().messages({
          'string.empty': 'Tên không được để trống',
          'any.required': 'Tên là bắt buộc',
        }),
        slug: Joi.string().trim().min(1).required().messages({
          'string.empty': 'Slug không được để trống',
          'any.required': 'Slug là bắt buộc',
        }),
        price: Joi.number().precision(2).min(1).required().messages({
          'string.empty': 'Giá không được để trống',
          'any.required': 'Giá là bắt buộc',
        }),
        variantColor: Joi.string().trim().min(1).required().messages({
          'string.empty': 'Biến thể màu sắc không được để trống',
          'any.required': 'Biến thể màu sắc là bắt buộc',
        }),
        variantSize: Joi.string().trim().min(1).required().messages({
          'string.empty': 'Biến thể kích thước không được để trống',
          'any.required': 'Biến thể kích thước là bắt buộc',
        }),
        itemTotal: Joi.number().precision(2).min(1).required().messages({
          'string.empty': 'Giá tổng không được để trống',
          'any.required': 'Giá tổng là bắt buộc',
        }),
        weight: Joi.number().precision(2).default(1).messages({
          'number.base': 'Cân nặng phải là một số',
        }),
      })
    )
    .required()
    .messages({
      'any.required': 'Danh sách sản phẩm là bắt buộc',
    }),
  status: Joi.array()
    .items(
      Joi.object({
        status: Joi.string()
          .trim()
          .min(1)
          .valid(...Object.values(OrderStatus))
          .required()
          .messages({
            'string.empty': 'Trạng thái không được để trống',
            'any.required': 'Trạng thái là bắt buộc',
          }),
        note: Joi.string().trim().min(1).required().messages({
          'string.empty': 'Ghi chú không được để trống',
          'any.required': 'Ghi chú là bắt buộc',
        }),
        createdAt: Joi.date().timestamp('javascript').default(Date.now),
      })
    )
    .default([
      {
        status: OrderStatus.pending,
        note: 'Đơn hàng chờ xác nhận',
        createdAt: Joi.date().timestamp('javascript').default(Date.now),
      },
    ]),
  warehouseId: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Id nhà kho không được để trống',
    'any.required': 'Id nhà kho là bắt buộc',
  }),
  supplierId: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Id nhà cung cấp không được để trống',
    'any.required': 'Id nhà cung cấp là bắt buộc',
  }),
  totalPrice: Joi.number().precision(2).min(1).required().messages({
    'string.empty': 'Giá tổng không được để trống',
    'any.required': 'Giá tổng là bắt buộc',
  }),
  paymentMethod: Joi.valid('Tiền mặt', 'Chuyển khoản', 'VNPAY').default(
    'Tiền mặt'
  ),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_GOODS_ORDERS = Joi.object({
  userId: Joi.string().trim().min(1).messages({
    'string.empty': 'Id người dùng không được để trống',
  }),
  goodsOrderCode: Joi.string().trim().min(1).messages({
    'string.empty': 'Mã hàng hóa đơn hàng không được để trống',
  }),
  productsList: Joi.array().items(
    Joi.object({
      _id: Joi.string().trim().min(1).messages({
        'string.empty': 'Id sản phẩm không được để trống',
      }),
      quantity: Joi.number().integer().messages({
        'string.empty': 'Tồn kho không được để trống',
      }),
      image: Joi.string().trim().min(1).messages({
        'string.empty': 'Ảnh không được để trống',
      }),
      name: Joi.string().trim().min(1).messages({
        'string.empty': 'Tên không được để trống',
      }),
      slug: Joi.string().trim().min(1).messages({
        'string.empty': 'Slug không được để trống',
      }),
      price: Joi.number().precision(2).min(1).messages({
        'string.empty': 'Giá không được để trống',
      }),
      variantColor: Joi.string().trim().min(1).messages({
        'string.empty': 'Biến thể màu sắc không được để trống',
      }),
      variantSize: Joi.string().trim().min(1).messages({
        'string.empty': 'Biến thể kích thước không được để trống',
      }),
      itemTotal: Joi.number().precision(2).min(1).messages({
        'string.empty': 'Giá tổng không được để trống',
      }),
      weight: Joi.number().precision(2).default(1).messages({
        'number.base': 'Cân nặng phải là một số',
      }),
    })
  ),
  status: Joi.array()
    .items(
      Joi.object({
        status: Joi.string()
          .trim()
          .min(1)
          .valid(...Object.values(OrderStatus))

          .messages({
            'string.empty': 'Trạng thái không được để trống',
          }),
        note: Joi.string().trim().min(1).messages({
          'string.empty': 'Ghi chú không được để trống',
        }),
        createdAt: Joi.date().timestamp('javascript').default(Date.now),
      })
    )
    .default([
      {
        status: OrderStatus.pending,
        note: 'Đơn hàng chờ xác nhận',
        createdAt: Joi.date().timestamp('javascript').default(Date.now),
      },
    ]),
  warehouseId: Joi.string().trim().min(1).messages({
    'string.empty': 'Id nhà kho không được để trống',
  }),
  supplierId: Joi.string().trim().min(1).messages({
    'string.empty': 'Id nhà cung cấp không được để trống',
  }),
  totalPrice: Joi.number().precision(2).min(1).messages({
    'string.empty': 'Giá tổng không được để trống',
  }),
  paymentMethod: Joi.valid('Tiền mặt', 'Chuyển khoản', 'VNPAY').default(
    'Tiền mặt'
  ),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
