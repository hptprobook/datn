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
  confirmed: 'confirmed',
  onHold: 'onHold',
  shipping: 'shipping',
};
const OrderPayment = {
  COD: 'COD',
  payment: 'payment',
};

export const SAVE_ORDER = Joi.object({
  userId: Joi.string().trim().min(1).required(),
  orderCode: Joi.string().trim().min(1),
  productsList: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().trim().min(1).required(),
        quantity: Joi.number().integer().min(1).required(),
        image: Joi.string().trim().min(1).required(),
        slug: Joi.string().trim().min(1).required(),
        name: Joi.string().trim().min(1).required(),
        price: Joi.number().min(1).required(),
        variantColor: Joi.string().trim().min(1).required(),
        variantSize: Joi.string().trim().min(1).required(),
        itemTotal: Joi.number().precision(2).required(),
        weight: Joi.number().min(1).required(),
      })
    )
    .required(),
  status: Joi.array()
    .items(
      Joi.object({
        status: Joi.string()
          .trim()
          .min(1)
          .valid(...Object.values(OrderStatus)),
        note: Joi.string().trim().min(1).required(),
        createdAt: Joi.date().timestamp('javascript'),
      })
    )
    .default([
      {
        status: OrderStatus.pending,
        note: 'Đơn hàng chờ xác nhận',
        createdAt: Date.now(),
      },
    ]),
  shippingInfo: Joi.object({
    provinceName: Joi.string().trim().min(1),
    districtName: Joi.string().trim().min(1),
    districtCode: Joi.number().min(1),
    wardName: Joi.string().trim().min(1),
    wardCode: Joi.number().min(1),
    detailAddress: Joi.string().trim().min(1),
    phone: Joi.string().trim().min(1),
    name: Joi.string().trim().min(1),
    note: Joi.string().trim().min(1).allow('', null),
  }).required(),
  email: Joi.string().trim().min(1).email().required(),
  totalPrice: Joi.number().min(1).required(),
  shipping: Joi.object({
    shippingType: Joi.string()
      .trim()
      .min(1)
      .valid(...Object.values(OrderPayment)),
    fee: Joi.number().min(1),
    deliveryUnit: Joi.string().trim().min(1).default('Giao hàng nhanh'),
    status: Joi.string().trim().min(1),
    detailAddress: Joi.string().trim().min(1),
    estimatedDeliveryDate: Joi.date().timestamp('javascript').default(Date.now),
    phone: Joi.string().trim().min(1),
    name: Joi.string().trim().min(1),
  }).required(),
  couponId: Joi.array().items(Joi.string().trim().min(1)).default([]),
  discountPercentage: Joi.boolean().default(false),
  discountPrice: Joi.number().min(0),
  totalCapitalPrice: Joi.number().min(0),
  totalProfit: Joi.number().min(0),
  paymentMethod: Joi.valid('Tiền mặt', 'Chuyển khoản', 'VNPAY').default(
    'Tiền mặt'
  ),
  type: Joi.string().trim().min(1).default('userOrder'),
});

export const SAVE_ORDER_NOT_LOGIN = Joi.object({
  orderCode: Joi.string().trim().min(1),
  productsList: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().trim().min(1).required(),
        slug: Joi.string().trim().min(1).required(),
        quantity: Joi.number().integer().min(1).required(),
        image: Joi.string().trim().min(1).required(),
        name: Joi.string().trim().min(1).required(),
        price: Joi.number().min(1).required(),
        variantColor: Joi.string().trim().min(1).required(),
        variantSize: Joi.string().trim().min(1).required(),
        itemTotal: Joi.number().precision(2).required(),
      })
    )
    .required(),
  status: Joi.array()
    .items(
      Joi.object({
        status: Joi.string()
          .trim()
          .min(1)
          .valid(...Object.values(OrderStatus)),
        note: Joi.string()
          .trim()
          .min(1)
          .required()
          .default('Đơn hàng chờ xác nhận'),
        createdAt: Joi.date().timestamp('javascript').default(Date.now),
      })
    )
    .default([
      {
        status: OrderStatus.pending,
        note: 'Đơn hàng chờ xác nhận',
        createdAt: Date.now(),
      },
    ]),
  shippingInfo: Joi.object({
    provinceName: Joi.string().trim().min(1),
    districtName: Joi.string().trim().min(1),
    districtCode: Joi.number().min(1),
    wardName: Joi.string().trim().min(1),
    wardCode: Joi.number().min(1),
    detailAddress: Joi.string().trim().min(1),
    phone: Joi.string().trim().min(1),
    name: Joi.string().trim().min(1),
    note: Joi.string().trim().min(1).allow('', null),
  }).required(),
  email: Joi.string().trim().min(1).email().required(),
  totalPrice: Joi.number().min(1).required(),
  shipping: Joi.object({
    shippingType: Joi.string()
      .trim()
      .min(1)
      .valid(...Object.values(OrderPayment)),
    fee: Joi.number().min(1),
    deliveryUnit: Joi.string().trim().min(1).default('Giao hàng nhanh'),
    status: Joi.string().trim().min(1).default('pending'),
    detailAddress: Joi.string().trim().min(1),
    estimatedDeliveryDate: Joi.date().timestamp('javascript').default(Date.now),
    phone: Joi.string().trim().min(1),
    name: Joi.string().trim().min(1),
  }).required(),
  couponId: Joi.array().items(Joi.string().trim().min(1)),
  discountPercentage: Joi.boolean().default(false),
  discountPrice: Joi.number().min(0),
  totalCapitalPrice: Joi.number().min(0),
  totalProfit: Joi.number().min(0),
  paymentMethod: Joi.valid('Tiền mặt', 'Chuyển khoản', 'VNPAY').default(
    'Tiền mặt'
  ),
  type: Joi.string().trim().min(1).default('notLoginOrder'),
});

export const SAVE_ORDER_AT_STORE = Joi.object({
  staffId: Joi.string().trim().min(1).required(),
  name: Joi.string().trim().default('Người mua hàng').messages({
    'string.empty': 'Tên khách hàng không được để trống',
  }),
  phone: Joi.string().trim().default(null),
  productsList: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().trim().min(1).required(),
        slug: Joi.string().trim().min(1).required(),
        quantity: Joi.number().integer().min(1).required(),
        image: Joi.string().trim().min(1).required(),
        name: Joi.string().trim().min(1).required(),
        price: Joi.number().min(1).required(),
        variantColor: Joi.string().trim().min(1).required(),
        variantSize: Joi.string().trim().min(1).required(),
        itemTotal: Joi.number().precision(2).required(),
      })
    )
    .required(),
  status: Joi.array()
    .items(
      Joi.object({
        status: Joi.string().trim().min(1).valid('success', 'returned'),
        note: Joi.string().trim().min(1).default('Đơn hàng bán tại quầy'),
        createdAt: Joi.date().timestamp('javascript').default(Date.now),
      })
    )
    .default([
      {
        status: 'success',
        note: 'Đơn hàng bán tại quầy',
        createdAt: Date.now(),
      },
    ]),
  couponId: Joi.array().items(Joi.string().trim()),
  totalPrice: Joi.number().min(1).required(),
  discountPercentage: Joi.boolean().default(false),
  discountPrice: Joi.number().min(0),
  totalCapitalPrice: Joi.number().min(0),
  totalProfit: Joi.number().min(0),
  needPay: Joi.number().min(0),
  paymentMethod: Joi.valid('Tiền mặt', 'Chuyển khoản', 'VNPAY').default(
    'Tiền mặt'
  ),
  amount_paid_by: Joi.number().default(0).messages({
    'number.base': 'Số tiền khách trả bắt buộc phải là số',
  }),
  amount_paid_to: Joi.number().default(0).messages({
    'number.base': 'Số tiền trả khách bắt buộc phải là số',
  }),
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

export const UPDATE_ORDER_AT_STORE = Joi.object({
  name: Joi.string().trim().min(1).messages({
    'string.empty': 'Tên khách hàng không được để trống',
  }),
  phone: Joi.string().trim().default(null),
  productsList: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().trim().min(1).required(),
        slug: Joi.string().trim().min(1).required(),
        quantity: Joi.number().integer().min(1).required(),
        image: Joi.string().trim().min(1).required(),
        name: Joi.string().trim().min(1).required(),
        price: Joi.number().min(1).required(),
        variantColor: Joi.string().trim().min(1).required(),
        variantSize: Joi.string().trim().min(1).required(),
        itemTotal: Joi.number().precision(2).required(),
      })
    )
    .required(),
  status: Joi.array().items(
    Joi.object({
      status: Joi.string().trim().min(1).valid('success', 'returned'),
      note: Joi.string().trim().min(1),
      createdAt: Joi.date().timestamp('javascript').default(Date.now),
    })
  ),
  couponId: Joi.array().items(Joi.string().trim()),
  totalPrice: Joi.number().min(0),
  discountPercentage: Joi.boolean().default(false),
  discountPrice: Joi.number().min(0),
  totalCapitalPrice: Joi.number().min(0),
  totalProfit: Joi.number().min(0),
  needPay: Joi.number().min(0),
  paymentMethod: Joi.valid('Tiền mặt', 'Chuyển khoản', 'VNPAY'),
  amount_paid_by: Joi.number().min(0).messages({
    'number.base': 'Số tiền khách trả bắt buộc phải là số',
  }),
  amount_paid_to: Joi.number().min(0).messages({
    'number.base': 'Số tiền trả khách bắt buộc phải là số',
  }),
  type: Joi.string()
    .trim()
    .valid('online', 'store', 'tiktok', 'facebook', 'zalo')
    .messages({
      'string.base': 'Loại hóa đơn bắt buộc phải là chuỗi',
    }),
  note: Joi.string().trim().min(0),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_ORDER = Joi.object({
  productsList: Joi.array().items(
    Joi.object({
      _id: Joi.string().trim().min(1),
      quantity: Joi.number().integer().min(1),
      price: Joi.number().min(1),
      slug: Joi.string().trim().min(1).required(),
      variantColor: Joi.string().trim().min(1),
      variantSize: Joi.string().trim().min(1),
      itemTotal: Joi.number().precision(2),
      image: Joi.string().trim().min(1),
      name: Joi.string().trim().min(1),
    })
  ),
  status: Joi.array().items(
    Joi.object({
      status: Joi.string()
        .trim()
        .valid(...Object.values(OrderStatus))
        .default(OrderStatus.pending),
      note: Joi.string().trim().min(1),
      createdAt: Joi.date().timestamp('javascript').default(Date.now),
      updatedAt: Joi.date().timestamp('javascript').default(Date.now),
    })
  ),
  shippingInfo: Joi.object({
    provinceName: Joi.string().trim().min(1),
    districtName: Joi.string().trim().min(1),
    districtCode: Joi.number().min(1),
    wardName: Joi.string().trim().min(1),
    wardCode: Joi.number().min(1),
    detailAddress: Joi.string().trim().min(1),
    phone: Joi.string().trim().min(1),
    name: Joi.string().trim().min(1),
    note: Joi.string().trim().min(1).allow('', null),
  }),
  email: Joi.string().trim().min(1).email(),
  totalPrice: Joi.number().min(1),
  shipping: Joi.object({
    shippingType: Joi.string()
      .trim()
      .min(1)
      .valid(...Object.values(OrderPayment)),
    fee: Joi.number().min(1),
    deliveryUnit: Joi.string().trim().min(1),
    status: Joi.string().trim().min(1),
    detailAddress: Joi.string().trim().min(1),
    estimatedDeliveryDate: Joi.date().timestamp('javascript').default(Date.now),
    phone: Joi.string().trim().min(1),
    name: Joi.string().trim().min(1),
  }),
  couponId: Joi.array().items(Joi.string().trim().min(1)),
  discountPercentage: Joi.boolean().default(false),
  discountPrice: Joi.number().min(0),
  totalCapitalPrice: Joi.number().min(0),
  totalProfit: Joi.number().min(0),
});

export const CHECK_STOCK = Joi.array()
  .items(
    Joi.object({
      _id: Joi.string().trim().min(1).required(),
      quantity: Joi.number().integer().min(1).required(),
      color: Joi.string().trim().min(1).required(),
      size: Joi.string().trim().min(1).required(),
    })
  )
  .required();
