import Joi from 'joi';
// import { ObjectId } from 'mongodb';

const OrderStatus = {
  paymentPending: 'paymentPending', // Chờ thanh toán
  pending: 'pending', // Chờ xác nhận
  confirmed: 'confirmed', // Đã xác nhận
  shipped: 'shipped', // Đã giao cho ĐVVC
  shipping: 'shipping', // Shipper đang trên đường tới
  delivered: 'delivered', // Đã nhận hàng
  returned: 'returned', // Trả hàng
  cancelled: 'cancelled', // Huỷ
  completed: 'completed', // Hoàn thành
};
const OrderPayment = {
  cod: 'cod',
  payment: 'payment',
};

export const SAVE_ORDER = Joi.object({
  userId: Joi.string().trim().min(1).required(), // ID của người dùng đặt đơn hàng
  orderCode: Joi.string().trim().min(1), // Mã đơn hàng
  productsList: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().trim().min(1).required(), // ID của sản phẩm
        quantity: Joi.number().integer().min(1).required(), // Số lượng sản phẩm
        image: Joi.string().trim().min(1).required(), // Đường dẫn ảnh sản phẩm
        slug: Joi.string().trim().min(1).required(), // Slug của sản phẩm
        name: Joi.string().trim().min(1).required(), // Tên sản phẩm
        sku: Joi.string().trim().min(1).required(), // Tên sản phẩm
        price: Joi.number().min(1).required(), // Giá sản phẩm
        variantColor: Joi.string().trim().min(1).required(), // Màu sắc sản phẩm
        variantSize: Joi.string().trim().min(1).required(), // Kích thước sản phẩm
        itemTotal: Joi.number().precision(2).required(), // Tổng giá trị sản phẩm
        weight: Joi.number().min(1).required(), // Khối lượng của sản phẩm
      })
    )
    .required(), // Danh sách sản phẩm trong đơn hàng
  status: Joi.array()
    .items(
      Joi.object({
        status: Joi.string()
          .trim()
          .min(1)
          .valid(...Object.values(OrderStatus)), // Trạng thái đơn hàng
        note: Joi.string().trim().min(1).default('Không có ghi chú'), // Ghi chú trạng thái
        reason: Joi.string().trim().min(1).allow('', null).default(null),
        returnStatus: Joi.string()
          .trim()
          .valid('pending', 'approved', 'rejected', null) // Trạng thái trả hàng hợp lệ
          .default(null),
        createdAt: Joi.date().timestamp('javascript').default(Date.now), // Thời gian tạo trạng thái
      })
    )
    .default([
      {
        status: OrderStatus.pending,
        note: 'Đơn hàng chờ xác nhận',
        createdAt: Date.now(),
      },
    ]), // Lịch sử trạng thái của đơn hàng
  shippingInfo: Joi.object({
    provinceName: Joi.string().trim().min(1), // Tên tỉnh/thành phố
    districtName: Joi.string().trim().min(1), // Tên quận/huyện
    districtCode: Joi.number().min(1), // Mã quận/huyện
    wardName: Joi.string().trim().min(1), // Tên phường/xã
    wardCode: Joi.number().min(1), // Mã phường/xã
    detailAddress: Joi.string().trim().min(1), // Địa chỉ chi tiết
    phone: Joi.string().trim().min(1), // Số điện thoại người nhận
    name: Joi.string().trim().min(1), // Tên người nhận hàng
    note: Joi.string().trim().min(1).allow('', null), // Ghi chú giao hàng
    fullAddress: Joi.string().trim().min(1), // Địa chỉ đầy đủ
  }).required(), // Thông tin giao hàng
  email: Joi.string().trim().min(1).email().required(), // Email người đặt hàng
  totalPrice: Joi.number().min(1).required(), // Tổng giá trị đơn hàng

  shippingType: Joi.string()
    .trim()
    .min(1)
    .valid(...Object.values(OrderPayment)), // Phương thức giao hàng
  fee: Joi.number().min(1), // Phí giao hàng
  deliveryUnit: Joi.string().trim().min(1).default('Giao hàng nhanh'), // Đơn vị vận chuyển
  estimatedDeliveryDate: Joi.date().timestamp('javascript').default(Date.now), // Ngày dự kiến giao hàng

  couponId: Joi.array().items(Joi.string().trim().min(1)).default([]), // Mã giảm giá sử dụng trong đơn hàng
  discountPercentage: Joi.boolean().default(false), // Xác định giảm giá theo phần trăm
  discountPrice: Joi.number().min(0), // Số tiền giảm giá
  totalPayment: Joi.number().min(0).required(), // Tổng giá trị thanh toán
  totalCapitalPrice: Joi.number().min(0), // Tổng giá vốn của sản phẩm
  totalProfit: Joi.number().min(0), // Tổng lợi nhuận
  paymentMethod: Joi.valid('Tiền mặt', 'Chuyển khoản', 'VNPAY').default(
    'Tiền mặt'
  ), // Phương thức thanh toán
  type: Joi.string().trim().min(1).default('userOrder'), // Loại đơn hàng
  isComment: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now), // Thời gian tạo trạng thái
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
        sku: Joi.string().trim().min(1).required(),
        price: Joi.number().min(1).required(),
        variantColor: Joi.string().trim().min(1).required(),
        variantSize: Joi.string().trim().min(1).required(),
        itemTotal: Joi.number().precision(2).required(),
        weight: Joi.number().min(1).required(), // Khối lượng của sản phẩm
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
        note: Joi.string().trim().min(1).default('Đơn hàng chờ xác nhận'),
        reason: Joi.string().trim().min(1).allow('', null).default(null),
        returnStatus: Joi.string()
          .trim()
          .valid('pending', 'approved', 'rejected', null) // Trạng thái trả hàng hợp lệ
          .default(null),
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
    fullAddress: Joi.string().trim().min(1),
  }).required(),
  email: Joi.string().trim().min(1).email().required(),
  totalPrice: Joi.number().min(1).required(),

  shippingType: Joi.string()
    .trim()
    .min(1)
    .valid(...Object.values(OrderPayment)),
  fee: Joi.number().min(1),
  deliveryUnit: Joi.string().trim().min(1).default('Giao hàng nhanh'),
  estimatedDeliveryDate: Joi.date().timestamp('javascript').default(Date.now),

  couponId: Joi.array().items(Joi.string().trim().min(1)),
  discountPercentage: Joi.boolean().default(false),
  discountPrice: Joi.number().min(0),
  totalPayment: Joi.number().min(0).required(),
  totalCapitalPrice: Joi.number().min(0),
  totalProfit: Joi.number().min(0),
  paymentMethod: Joi.valid('Tiền mặt', 'VNPAY'),
  type: Joi.string().trim().min(1).default('notLoginOrder'),
  createdAt: Joi.date().timestamp('javascript').default(Date.now), // Thời gian tạo trạng thái
});

export const UPDATE_ORDER = Joi.object({
  productsList: Joi.array().items(
    Joi.object({
      _id: Joi.string().trim().min(1).required(), // ID của sản phẩm
      quantity: Joi.number().integer().min(1).required(), // Số lượng sản phẩm
      image: Joi.string().trim().min(1).required(), // Đường dẫn ảnh sản phẩm
      slug: Joi.string().trim().min(1).required(), // Slug của sản phẩm
      name: Joi.string().trim().min(1).required(), // Tên sản phẩm
      sku: Joi.string().trim().min(1).required(), // Tên sản phẩm
      price: Joi.number().min(1).required(), // Giá sản phẩm
      variantColor: Joi.string().trim().min(1).required(), // Màu sắc sản phẩm
      variantSize: Joi.string().trim().min(1).required(), // Kích thước sản phẩm
      itemTotal: Joi.number().precision(2).required(), // Tổng giá trị sản phẩm
      weight: Joi.number().min(1).required(), // Khối lượng của sản phẩm
    })
  ), // Danh sách sản phẩm trong đơn hàng
  status: Joi.array().items(
    Joi.object({
      status: Joi.string()
        .trim()
        .min(1)
        .valid(...Object.values(OrderStatus)), // Trạng thái đơn hàng
      note: Joi.string().trim().min(1).default('Không có ghi chú'), // Ghi chú trạng thái
      reason: Joi.string().trim().min(1).allow('', null).default(null),
      returnStatus: Joi.string()
        .trim()
        .valid('pending', 'approved', 'rejected', null) // Trạng thái trả hàng hợp lệ
        .default(null),
      createdAt: Joi.date().timestamp('javascript').default(Date.now), // Thời gian tạo trạng thái
    })
  ), // Lịch sử trạng thái của đơn hàng

  shippingInfo: Joi.object({
    provinceName: Joi.string().trim().min(1), // Tên tỉnh/thành phố
    districtName: Joi.string().trim().min(1), // Tên quận/huyện
    districtCode: Joi.number().min(1), // Mã quận/huyện
    wardName: Joi.string().trim().min(1), // Tên phường/xã
    wardCode: Joi.number().min(1), // Mã phường/xã
    detailAddress: Joi.string().trim().min(1), // Địa chỉ chi tiết
    phone: Joi.string().trim().min(1), // Số điện thoại người nhận
    name: Joi.string().trim().min(1), // Tên người nhận hàng
    note: Joi.string().trim().min(1).allow('', null), // Ghi chú giao hàng
    fullAddress: Joi.string().trim().min(1),
  }), // Thông tin giao hàng
  email: Joi.string().trim().min(1).email(), // Email người đặt hàng
  totalPrice: Joi.number().min(1), // Tổng giá trị đơn hàng

  shippingType: Joi.string()
    .trim()
    .min(1)
    .valid(...Object.values(OrderPayment)), // Phương thức giao hàng
  fee: Joi.number().min(1), // Phí giao hàng
  deliveryUnit: Joi.string().trim().min(1), // Đơn vị vận chuyển
  estimatedDeliveryDate: Joi.date().timestamp('javascript'), // Ngày dự kiến giao hàng

  couponId: Joi.array().items(Joi.string().trim().min(1)), // Mã giảm giá sử dụng trong đơn hàng
  discountPercentage: Joi.boolean(), // Xác định giảm giá theo phần trăm
  discountPrice: Joi.number().min(0), // Số tiền giảm giá
  totalCapitalPrice: Joi.number().min(0), // Tổng giá vốn của sản phẩm
  totalProfit: Joi.number().min(0), // Tổng lợi nhuận
  paymentMethod: Joi.valid('Tiền mặt', 'Chuyển khoản', 'VNPAY'), // Phương thức thanh toán
  type: Joi.string().trim().min(1), // Loại đơn hàng
  isComment: Joi.boolean(),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now), // Thời gian chỉnh sửa đơn hàng
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
