import Joi from 'joi';

export const SAVE_PAYMENT = Joi.object({
    orderId: Joi.string().trim().min(1).required().messages({
        'string.empty': 'Mã đơn hàng không được để trống',
        'any.required': 'Mã đơn hàng là bắt buộc',
    }),
    totalAmount: Joi.number().min(1).required().messages({
        'number.base': 'Tổng số tiền phải là một số',
        'number.min': 'Tổng số tiền phải lớn hơn hoặc bằng {#limit}',
        'any.required': 'Tổng số tiền là bắt buộc',
    }),
    status: Joi.string()
        .trim()
        .min(1)
        .valid('pending', 'completed')
        .default('pending')
        .messages({
            'string.base': 'Trạng thái phải là một chuỗi',
            'string.empty': 'Trạng thái không được để trống',
            'string.min': 'Trạng thái phải có ít nhất {#limit} ký tự',
            'any.only':
                'Trạng thái phải là một trong các giá trị sau: pending, completed',
        }),
    paymentDate: Joi.date().timestamp('javascript').default(Date.now),
    shippingInfo: Joi.object({
        transactionMethod: Joi.string()
            .trim()
            .min(1)
            .valid('card', 'bank', 'wallet')
            .messages({
                'string.base': 'Phương thức giao dịch phải là một chuỗi',
                'string.empty': 'Phương thức giao dịch không được để trống',
                'string.min':
                    'Phương thức giao dịch phải có ít nhất {#limit} ký tự',
                'any.only':
                    'Phương thức giao dịch phải là một trong các giá trị sau: card, bank, wallet',
            }),
        amount: Joi.number().min(1).messages({
            'number.base': 'Số lượng phải là một số',
            'number.min': 'Số lượng phải lớn hơn hoặc bằng {#limit}',
        }),
        status: Joi.string().trim().min(1).valid('failed', 'success').messages({
            'string.base': 'Trạng thái phải là một chuỗi',
            'string.empty': 'Trạng thái không được để trống',
            'string.min': 'Trạng thái phải có ít nhất {#limit} ký tự',
            'any.only':
                'Trạng thái phải là một trong các giá trị sau: failed, success',
        }),
        date: Joi.date().timestamp('javascript').default(Date.now),
        cardType: Joi.string()
            .trim()
            .min(1)
            .valid('visa', 'mastercard')
            .messages({
                'string.base': 'Loại thẻ phải là một chuỗi',
                'string.empty': 'Loại thẻ không được để trống',
                'string.min': 'Loại thẻ phải có ít nhất {#limit} ký tự',
                'any.only':
                    'Loại thẻ phải là một trong các giá trị sau: visa, mastercard',
            }),
        cardNumber: Joi.string().trim().min(1).messages({
            'string.base': 'Số thẻ phải là một chuỗi',
            'string.empty': 'Số thẻ không được để trống',
            'string.min': 'Số thẻ phải có ít nhất {#limit} ký tự',
        }),
        cardholderName: Joi.string().trim().min(1).messages({
            'string.base': 'Tên chủ thẻ phải là một chuỗi',
            'string.empty': 'Tên chủ thẻ không được để trống',
            'string.min': 'Tên chủ thẻ phải có ít nhất {#limit} ký tự',
        }),
        expiryDate: Joi.date().timestamp('javascript').default(Date.now),
        cardTransactionId: Joi.number().min(1).messages({
            'number.base': 'Mã giao dịch phải là một số',
            'number.min': 'Mã giao dịch phải lớn hơn hoặc bằng {#limit}',
        }),
        bankName: Joi.string().trim().min(1).messages({
            'string.base': 'Tên ngân hàng phải là một chuỗi',
            'string.empty': 'Tên ngân hàng không được để trống',
            'string.min': 'Tên ngân hàng phải có ít nhất {#limit} ký tự',
        }),
        bankNumber: Joi.string().trim().min(1).messages({
            'string.base': 'Số thẻ ngân hàng phải là một chuỗi',
            'string.empty': 'Số thẻ ngân hàng không được để trống',
            'string.min': 'Số thẻ ngân hàng phải có ít nhất {#limit} ký tự',
        }),
        bankholderName: Joi.string().trim().min(1).messages({
            'string.base': 'Tên chủ thẻ ngân hàng phải là một chuỗi',
            'string.empty': 'Tên chủ thẻ ngân hàng không được để trống',
            'string.min':
                'Tên chủ thẻ ngân hàng phải có ít nhất {#limit} ký tự',
        }),
        bankTransactionId: Joi.string().trim().min(1).messages({
            'string.base': 'Mã giao dịch phải là một chuỗi',
            'string.empty': 'Mã giao dịch không được để trống',
            'string.min': 'Mã giao dịch phải có ít nhất {#limit} ký tự',
        }),
        walletProvider: Joi.string().trim().min(1).messages({
            'string.base': 'Nhà cung cấp ví phải là một chuỗi',
            'string.empty': 'Nhà cung cấp ví không được để trống',
            'string.min': 'Nhà cung cấp ví phải có ít nhất {#limit} ký tự',
        }),
        walletId: Joi.string().trim().min(1).messages({
            'string.base': 'Mã ví phải là một chuỗi',
            'string.empty': 'Mã ví không được để trống',
            'string.min': 'Mã ví phải có ít nhất {#limit} ký tự',
        }),
        walletholderName: Joi.string().trim().min(1).messages({
            'string.base': 'Tên chủ ví phải là một chuỗi',
            'string.empty': 'Tên chủ ví không được để trống',
            'string.min': 'Tên chủ ví phải có ít nhất {#limit} ký tự',
        }),
        walletTransactionId: Joi.string().trim().min(1).messages({
            'string.base': 'Mã giao dịch ví phải là một chuỗi',
            'string.empty': 'Mã giao dịch ví không được để trống',
            'string.min': 'Mã giao dịch ví phải có ít nhất {#limit} ký tự',
        }),
    })
        .required()
        .messages({
            'any.required': 'thông tin vận chuyển là bắt buộc',
        }),
    paidAmount: Joi.number().min(1).required().messages({
        'number.base': 'Số tiền đã trả phải là một số',
        'number.min': 'Số tiền đã trả phải lớn hơn hoặc bằng {#limit}',
        'any.required': 'Số tiền đã trả là bắt buộc',
    }),
    remainingAmount: Joi.number().min(1).required().messages({
        'number.base': 'Số tiền còn lại phải là một số',
        'number.min': 'Số tiền còn lại phải lớn hơn hoặc bằng {#limit}',
        'any.required': 'Số tiền còn lại là bắt buộc',
    }),
});

export const UPDATE_PAYMENT = Joi.object({
    orderId: Joi.string().trim().min(1).messages({
        'string.empty': 'Mã đơn hàng không được để trống',
    }),
    totalAmount: Joi.number().min(1).messages({
        'number.base': 'Tổng số tiền phải là một số',
        'number.min': 'Tổng số tiền phải lớn hơn hoặc bằng {#limit}',
    }),
    status: Joi.string()
        .trim()
        .min(1)
        .valid('pending', 'completed')
        .default('pending')
        .messages({
            'string.base': 'Trạng thái phải là một chuỗi',
            'string.empty': 'Trạng thái không được để trống',
            'string.min': 'Trạng thái phải có ít nhất {#limit} ký tự',
            'any.only':
                'Trạng thái phải là một trong các giá trị sau: pending, completed',
        }),
    paymentDate: Joi.date().timestamp('javascript').default(Date.now),
    shippingInfo: Joi.object({
        transactionMethod: Joi.string()
            .trim()
            .min(1)
            .valid('card', 'bank', 'wallet')
            .messages({
                'string.base': 'Phương thức giao dịch phải là một chuỗi',
                'string.empty': 'Phương thức giao dịch không được để trống',
                'string.min':
                    'Phương thức giao dịch phải có ít nhất {#limit} ký tự',
                'any.only':
                    'Phương thức giao dịch phải là một trong các giá trị sau: card, bank, wallet',
            }),
        amount: Joi.number().min(1).messages({
            'number.base': 'Số lượng phải là một số',
            'number.min': 'Số lượng phải lớn hơn hoặc bằng {#limit}',
        }),
        status: Joi.string().trim().min(1).valid('failed', 'success').messages({
            'string.base': 'Trạng thái phải là một chuỗi',
            'string.empty': 'Trạng thái không được để trống',
            'string.min': 'Trạng thái phải có ít nhất {#limit} ký tự',
            'any.only':
                'Trạng thái phải là một trong các giá trị sau: failed, success',
        }),
        date: Joi.date().timestamp('javascript').default(Date.now),
        cardType: Joi.string()
            .trim()
            .min(1)
            .valid('visa', 'mastercard')
            .messages({
                'string.base': 'Loại thẻ phải là một chuỗi',
                'string.empty': 'Loại thẻ không được để trống',
                'string.min': 'Loại thẻ phải có ít nhất {#limit} ký tự',
                'any.only':
                    'Loại thẻ phải là một trong các giá trị sau: visa, mastercard',
            }),
        cardNumber: Joi.string().trim().min(1).messages({
            'string.base': 'Số thẻ phải là một chuỗi',
            'string.empty': 'Số thẻ không được để trống',
            'string.min': 'Số thẻ phải có ít nhất {#limit} ký tự',
        }),
        cardholderName: Joi.string().trim().min(1).messages({
            'string.base': 'Tên chủ thẻ phải là một chuỗi',
            'string.empty': 'Tên chủ thẻ không được để trống',
            'string.min': 'Tên chủ thẻ phải có ít nhất {#limit} ký tự',
        }),
        expiryDate: Joi.date().timestamp('javascript').default(Date.now),
        cardTransactionId: Joi.number().min(1).messages({
            'number.base': 'Mã giao dịch phải là một số',
            'number.min': 'Mã giao dịch phải lớn hơn hoặc bằng {#limit}',
        }),
        bankName: Joi.string().trim().min(1).messages({
            'string.base': 'Tên ngân hàng phải là một chuỗi',
            'string.empty': 'Tên ngân hàng không được để trống',
            'string.min': 'Tên ngân hàng phải có ít nhất {#limit} ký tự',
        }),
        bankNumber: Joi.string().trim().min(1).messages({
            'string.base': 'Số thẻ ngân hàng phải là một chuỗi',
            'string.empty': 'Số thẻ ngân hàng không được để trống',
            'string.min': 'Số thẻ ngân hàng phải có ít nhất {#limit} ký tự',
        }),
        bankholderName: Joi.string().trim().min(1).messages({
            'string.base': 'Tên chủ thẻ ngân hàng phải là một chuỗi',
            'string.empty': 'Tên chủ thẻ ngân hàng không được để trống',
            'string.min':
                'Tên chủ thẻ ngân hàng phải có ít nhất {#limit} ký tự',
        }),
        bankTransactionId: Joi.string().trim().min(1).messages({
            'string.base': 'Mã giao dịch phải là một chuỗi',
            'string.empty': 'Mã giao dịch không được để trống',
            'string.min': 'Mã giao dịch phải có ít nhất {#limit} ký tự',
        }),
        walletProvider: Joi.string().trim().min(1).messages({
            'string.base': 'Nhà cung cấp ví phải là một chuỗi',
            'string.empty': 'Nhà cung cấp ví không được để trống',
            'string.min': 'Nhà cung cấp ví phải có ít nhất {#limit} ký tự',
        }),
        walletId: Joi.string().trim().min(1).messages({
            'string.base': 'Mã ví phải là một chuỗi',
            'string.empty': 'Mã ví không được để trống',
            'string.min': 'Mã ví phải có ít nhất {#limit} ký tự',
        }),
        walletholderName: Joi.string().trim().min(1).messages({
            'string.base': 'Tên chủ ví phải là một chuỗi',
            'string.empty': 'Tên chủ ví không được để trống',
            'string.min': 'Tên chủ ví phải có ít nhất {#limit} ký tự',
        }),
        walletTransactionId: Joi.string().trim().min(1).messages({
            'string.base': 'Mã giao dịch ví phải là một chuỗi',
            'string.empty': 'Mã giao dịch ví không được để trống',
            'string.min': 'Mã giao dịch ví phải có ít nhất {#limit} ký tự',
        }),
    }),
    paidAmount: Joi.number().min(1).messages({
        'number.base': 'Số tiền đã trả phải là một số',
        'number.min': 'Số tiền đã trả phải lớn hơn hoặc bằng {#limit}',
    }),
    remainingAmount: Joi.number().min(1).messages({
        'number.base': 'Số tiền còn lại phải là một số',
        'number.min': 'Số tiền còn lại phải lớn hơn hoặc bằng {#limit}',
    }),
});
