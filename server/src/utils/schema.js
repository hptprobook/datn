/* eslint-disable comma-dangle */
import Joi from 'joi';

export const SAVE_USER_SCHEMA = Joi.object({
  //   password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  name: Joi.object({
    firstName: Joi.string().min(1).max(30).required(),
    lastName: Joi.string().min(1).max(30).required(),
  }),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  otp: Joi.string(),
  addresses: Joi.array().items(
    Joi.object({
      name: Joi.string().max(50),
      phone: Joi.string().max(50),
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
    .default(null),
  role: Joi.string().valid('root', 'employee', 'user', 'ban').default('user'),
  allowNotifies: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_USER = Joi.object({
  name: Joi.object({
    firstName: Joi.string().min(1).max(30),
    lastName: Joi.string().min(1).max(30),
  }),
  password: Joi.string(),
  otp: Joi.string(),
  addresses: Joi.array().items(
    Joi.object({
      name: Joi.string().max(50),
      phone: Joi.string().max(50),
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
    .default(null),
  role: Joi.string().valid('root', 'employee', 'user', 'ban').default('user'),
  allowNotifies: Joi.boolean().default(false),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
// category

// Carts
export const SAVE_CARTS = Joi.object({
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const ADD_CARTS = Joi.object({
  _id: Joi.string().required(),
  quantity: Joi.number().integer().min(1),
  vars: Joi.object({
    color: Joi.string(),
    size: Joi.string(),
  }),
});
export const ADD_QUANTITY_CARTS = Joi.object({
  _id: Joi.string().required(),
  quantity: Joi.number().integer().min(1),
  vars: Joi.object({
    color: Joi.string(),
    size: Joi.string(),
  }),
});
export const UPDATE_CARTS = Joi.object({
  userId: Joi.string(),
  // .required()
  products: Joi.array().items(
    Joi.object({
      _id: Joi.string(),
      // .required()
      quantity: Joi.number().integer().min(1),
      vars: Joi.object({
        color: Joi.string(),
        size: Joi.string(),
      }),
    })
  ),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

const OrderStatus = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
  FAILED: 'Failed',
  ON_HOLD: 'On Hold',
};
const OrderPaymen = {
  CREDIT_CART: 'Credit Card',
  CASH: 'Cash',
};

export const SAVE_ORDER = Joi.object({
  userId: Joi.string().required(),
  products: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().min(1).required(),
        vars: Joi.object({
          color: Joi.string(),
          size: Joi.string(),
        }),
      })
    )
    .required(),
  totalAmount: Joi.number().min(1).required(),
  shippingInfo: Joi.object({
    homeNumber: Joi.string(),
    street: Joi.string(),
    ward: Joi.string(),
    district: Joi.string(),
    province: Joi.string(),
    note: Joi.string(),
  }).required(),
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .default(OrderStatus.PENDING),
  note: Joi.string(),
  paymentMethod: Joi.string()
    .valid(...Object.values(OrderPaymen))
    .required(),
  orderDate: Joi.date().timestamp('javascript').default(Date.now),
  deliveryDate: Joi.date().timestamp('javascript').default(null),
});
// .valid(...Object.values(OrderStatus))

export const UPDATE_ORDER = Joi.object({
  shippingInfo: Joi.object({
    homeNumber: Joi.string(),
    street: Joi.string(),
    ward: Joi.string(),
    district: Joi.string(),
    province: Joi.string(),
    note: Joi.string(),
  }),
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .default(OrderStatus.PENDING),
  note: Joi.string(),
  paymentMethod: Joi.string().valid(...Object.values(OrderPaymen)),
  orderDate: Joi.date().timestamp('javascript').default(Date.now),
  deliveryDate: Joi.date().timestamp('javascript').default(null),
});
// .valid(...Object.values(OrderStatus))

export const CHECK_STOCK = Joi.array()
  .items(
    Joi.object({
      _id: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      color: Joi.string().required(),
      size: Joi.string().required(),
    })
  )
  .required();

export const SAVE_REVIEW = Joi.object({
  user_id: Joi.string().required(),
  order_id: Joi.string().required(),
  star: Joi.number().integer().min(1).required(),
  comment: Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
});

export const UPDATE_REVIEW = Joi.object({
  star: Joi.number().integer().min(1),
  comment: Joi.string(),
});
