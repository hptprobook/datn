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
    productsList: Joi.array()
        .items(
            Joi.object({
                _id: Joi.string().trim().min(1).required(),
                quantity: Joi.number().integer().min(1).required(),
                thumbnail: Joi.string().trim().min(1).required(),
                name: Joi.string().trim().min(1).required(),
                price: Joi.number().min(1).required(),
                color: Joi.string().trim().min(1).required(),
                size: Joi.string().trim().min(1).required(),
                totalPrice: Joi.number().precision(2).required(),
            })
        )
        .required(),
    status: Joi.array()
        .items(
            Joi.object({
                status: Joi.string().trim().min(1)
                    .valid(...Object.values(OrderStatus))
                    .default(OrderStatus.pending),
                note: Joi.string().trim().min(1).required(),
                createdAt: Joi.date().timestamp('javascript').default(Date.now),
                // updatedAt: Joi.date().timestamp('javascript').default(Date.now),
            })
        )
        .required(),

    shippingInfo: Joi.object({
        provinceName: Joi.string().trim().min(1),
        districtName: Joi.string().trim().min(1),
        districtCode: Joi.number().min(1),
        wardName: Joi.string().trim().min(1),
        wardCode: Joi.number().min(1),
        detailAddress: Joi.string().trim().min(1),
        phone: Joi.string().trim().min(1),
        name: Joi.string().trim().min(1),
    }).required(),
    email: Joi.string().trim().min(1).email().required(),
    totalPrice: Joi.number().min(1).required(),
    shipping: Joi.object({
        shippingType: Joi.string().trim().min(1)
            .valid(...Object.values(OrderPayment)),
        fee: Joi.number().min(1),
        deliveryUnit: Joi.string().trim().min(1),
        status: Joi.string().trim().min(1),
        detailAddress: Joi.string().trim().min(1),
        estimatedDeliveryDate: Joi.date().timestamp('javascript').default(Date.now),
        phone: Joi.string().trim().min(1),
        name: Joi.string().trim().min(1),
    }).required(),
    couponId: Joi.array().items(Joi.string().trim().min(1))
        .required(),
    discountPercentage: Joi.boolean().default(false),
    discountPrice: Joi.number().min(0),
    totalCapitalPrice: Joi.number().min(0),
    totalProfit: Joi.number().min(0),
    paymentMethod: Joi.valid(
        'Tiền mặt', 'Chuyển khoản', 'Ví điện tử', 'Thẻ tín dụng'
    ).default('Tiền mặt'),
});

export const UPDATE_ORDER = Joi.object({
    productsList: Joi.array()
        .items(
            Joi.object({
                _id: Joi.string().trim().min(1),
                quantity: Joi.number().integer().min(1),
                price: Joi.number().min(1),
                color: Joi.string().trim().min(1),
                size: Joi.string().trim().min(1),
                totalPrice: Joi.number().precision(2),
                thumbnail: Joi.string().trim().min(1),
                name: Joi.string().trim().min(1),
            })
        ),
    status: Joi.array()
        .items(
            Joi.object({
                status: Joi.string().trim().min(1)
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
    }),
    email: Joi.string().trim().min(1).email(),
    totalPrice: Joi.number().min(1),
    shipping: Joi.object({
        shippingType: Joi.string().trim().min(1)
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