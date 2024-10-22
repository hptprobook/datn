import Joi from 'joi';

export const STATIC_PAGE_SCHEMA = Joi.object({
    title: Joi.string().required().min(4).max(255).messages({
        'string.base': 'Tiêu đề phải là một chuỗi văn bản.',
        'string.empty': 'Tiêu đề không được để trống.',
        'string.min': 'Tiêu đề phải có ít nhất 4 ký tự.',
        'string.max': 'Tiêu đề không được vượt quá 255 ký tự.',
        'any.required': 'Tiêu đề là bắt buộc.',
    }),

    metaTitle: Joi.string().required().min(4).max(60).messages({
        'string.base': 'Tiêu đề SEO phải là một chuỗi văn bản.',
        'string.empty': 'Tiêu đề SEO không được để trống.',
        'string.min': 'Tiêu đề SEO phải có ít nhất 4 ký tự.',
        'string.max': 'Tiêu đề SEO không được vượt quá 60 ký tự.',
        'any.required': 'Tiêu đề SEO là bắt buộc.',
    }),

    metaDescription: Joi.string().required().min(4).max(160).messages({
        'string.base': 'Mô tả meta phải là một chuỗi văn bản.',
        'string.empty': 'Mô tả meta không được để trống.',
        'string.min': 'Mô tả meta phải có ít nhất 4 ký tự.',
        'string.max': 'Mô tả meta không được vượt quá 160 ký tự.',
        'any.required': 'Mô tả meta là bắt buộc.',
    }),

    metaKeywords: Joi.string().optional().max(255).messages({
        'string.base': 'Từ khóa SEO phải là một chuỗi văn bản.',
        'string.max': 'Từ khóa SEO không được vượt quá 255 ký tự.',
    }),

    slug: Joi.string().required().min(4).max(255).messages({
        'string.base': 'Slug phải là một chuỗi văn bản.',
        'string.empty': 'Slug không được để trống.',
        'string.min': 'Slug phải có ít nhất 4 ký tự.',
        'string.max': 'Slug không được vượt quá 255 ký tự.',
        'any.required': 'Slug là bắt buộc.',
    }),

    content: Joi.string().required().min(4).messages({
        'string.base': 'Nội dung phải là một chuỗi văn bản.',
        'string.empty': 'Nội dung không được để trống.',
        'string.min': 'Nội dung phải có ít nhất 4 ký tự.',
        'any.required': 'Nội dung là bắt buộc.',
    }),
    type: Joi.string().required().valid(
        'about', // Chúng tôi là ai
        'commit', // Cam kết của chúng tôi
        'storeSystem', // Hệ thống cửa hàng
        'orderHelp', // Hướng dẫn đặt hàng
        'paymentMethod', // Phương thức thanh toán
        'membershipPolicy', // Chính sách thành viên
        'pointsPolicy', // Chính sách tích - tiêu điểm
        'shippingPolicy', // Chính sách vận chuyển
        'inspectionPolicy', // Chính sách kiểm hàng
        'returnPolicy', // Chính sách đổi trả
        'termsConditions', // Điều kiện & Điều khoản
        'privacyPolicy' // Chính sách bảo mật
    ).messages({
        'string.base': 'Loại phải là một chuỗi văn bản.',
        'string.empty': 'Loại không được để trống.',
        'any.required': 'Loại là bắt buộc.',
        'any.only': 'Loại không hợp lệ.',
    }),
});
