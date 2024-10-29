
import Joi from 'joi';
export const RECEIPT_SCHEMA = Joi.object({
    orderId: Joi.string().trim().allow(null).messages({
        'string.base': 'Mã đơn hàng bắt buộc phải là chuỗi',
    }),
    userId: Joi.string().trim().allow(null).messages({
        'string.base': 'Mã người dùng bắt buộc phải là chuỗi',
    }),
    name: Joi.string().trim().required().messages({
        'string.base': 'Tên người nhận bắt buộc phải là chuỗi',
    }),
    phone: Joi.string().trim().allow(null).messages({
        'string.base': 'Số điện thoại bắt buộc phải là chuỗi',
    }),
    email: Joi.string().trim().allow(null).messages({
        'string.base': 'Email bắt buộc phải là chuỗi',
    }),
    status: Joi.string().trim().valid('pending', 'shipping', 'completed', 'canceled', 'returned').default('pending').required().messages({
        'string.base': 'Trạng thái bắt buộc phải là chuỗi',
    }),
    productList: Joi.array().items(
        Joi.object({
            productId: Joi.string().trim().required().messages({
                'string.base': 'Mã sản phẩm bắt buộc phải là chuỗi',
            }),
            name: Joi.string().trim().required().messages({
                'string.base': 'Tên sản phẩm bắt buộc phải là chuỗi',
            }),
            quantity: Joi.number().integer().required().messages({
                'number.base': 'Số lượng bắt buộc phải là số nguyên',
            }),
            basePrice: Joi.number().required().messages({
                'number.base': 'Giá cơ bản bắt buộc phải là số',
            }),
            price: Joi.number().required().messages({
                'number.base': 'Giá bán bắt buộc phải là số',
            }),
        })
    ),
    total: Joi.number().required().messages({
        'number.base': 'Tổng tiền bắt buộc phải là số',
    }),
    shippingFee: Joi.number().default(0).messages({
        'number.base': 'Phí vận chuyển bắt buộc phải là số',
    }),
    discount: Joi.number().required().default(0).messages({
        'number.base': 'Giảm giá bắt buộc phải là số',
    }),
    discountCode: Joi.string().trim().allow(null).messages({
        'string.base': 'Mã giảm giá phải là chuỗi',
    }),
    paymentMethod: Joi.string().trim().required().messages({
        'string.base': 'Phương thức thanh toán bắt buộc phải là chuỗi',
    }),
    type: Joi.string().trim().valid('online', 'store', 'tiktok', 'facebook', 'zalo').default('online').required().messages({
        'string.base': 'Loại hóa đơn bắt buộc phải là chuỗi',
    }),
    staffId: Joi.string().trim().allow(null).messages({
        'string.base': 'Mã nhân viên bắt buộc phải là chuỗi',
    }),
    province: Joi.string().trim().allow(null).required().messages({
        'string.base': 'Tỉnh/Thành phố bắt buộc phải là chuỗi',
    }),
    district: Joi.string().trim().allow(null).required().messages({
        'string.base': 'Quận/Huyện bắt buộc phải là chuỗi',
    }),
    ward: Joi.string().trim().allow(null).required().messages({
        'string.base': 'Phường/Xã bắt buộc phải là chuỗi',
    }),
    address: Joi.string().trim().allow(null).required().messages({
        'string.base': 'Địa chỉ bắt buộc phải là chuỗi',
    }),
    note: Joi.string().trim().allow(null).messages({
        'string.base': 'Ghi chú bắt buộc phải là chuỗi',
    }),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
