const Joi = require('joi');

export const CREATE_WEB = Joi.object({
    nameCompany: Joi.string().required().messages({
        'string.base': 'Tên công ty phải là một chuỗi văn bản.',
        'string.empty': 'Tên công ty không được để trống.',
        'any.required': 'Tên công ty là bắt buộc.',
    }),
    website: Joi.string().uri().required().messages({ // Giả sử 'link' là một URI hợp lệ
        'string.base': 'Website phải là một chuỗi văn bản.',
        'string.empty': 'Website không được để trống.',
        'string.uri': 'Website phải là một địa chỉ web hợp lệ.',
        'any.required': 'Website là bắt buộc.',
    }),
    address: Joi.string().required().messages({ // Giả sử 'address' là một chuỗi địa chỉ đơn giản
        'string.base': 'Địa chỉ phải là một chuỗi văn bản.',
        'string.empty': 'Địa chỉ không được để trống.',
        'any.required': 'Địa chỉ là bắt buộc.',
    }),
    email: Joi.string().email().messages({
        'string.base': 'Email phải là một chuỗi văn bản.',
        'string.email': 'Email không hợp lệ.',
    }),
    phone: Joi.string()
        .pattern(/^[0-9]+$/) // Chỉ cho phép số
        .required()
        .messages({
            'string.base': 'Số điện thoại phải là một chuỗi văn bản.',
            'string.empty': 'Số điện thoại không được để trống.',
            'string.pattern.base': 'Số điện thoại chỉ được chứa các chữ số.',
            'any.required': 'Số điện thoại là bắt buộc.',
        }),
    zalo:  Joi.string()
    .pattern(/^[0-9]+$/) // Chỉ cho phép số
    .required()
    .messages({
        'string.base': 'Zalo phải là một chuỗi văn bản.',
        'string.empty': 'Zalo không được để trống.',
        'string.pattern.base': 'Zalo chỉ được chứa các chữ số.',
        'any.required': 'Zalo là bắt buộc.',
    }),
    logo: Joi.string().required().messages({ // Giả sử 'media' là một đường dẫn hoặc tên tệp
        'string.base': 'Logo phải là một chuỗi văn bản.',
        'string.empty': 'Logo không được để trống.',
        'any.required': 'Logo là bắt buộc.',
    }),
    nameBank: Joi.string().messages({
        'string.base': 'Tên ngân hàng phải là một chuỗi văn bản.',
    }),
    numberBank: Joi.string()
        .pattern(/^[0-9]+$/) // Chỉ cho phép số
        .messages({
            'string.base': 'Số tài khoản ngân hàng phải là một chuỗi văn bản.',
            'string.pattern.base': 'Số tài khoản ngân hàng chỉ được chứa các chữ số.',
        }),
    nameholderBank: Joi.string().messages({
        'string.base': 'Tên chủ tài khoản ngân hàng phải là một chuỗi văn bản.',
    }),
    hotline: Joi.string()
        .pattern(/^[0-9]+$/) // Chỉ cho phép số
        .messages({
            'string.base': 'Hotline phải là một chuỗi văn bản.',
            'string.pattern.base': 'Hotline chỉ được chứa các chữ số.',
        }),
    linkGoogleMaps: Joi.string().uri().messages({
        'string.base': 'Liên kết Google Maps phải là một chuỗi văn bản.',
        'string.uri': 'Liên kết Google Maps phải là một địa chỉ web hợp lệ.',
    }),
    Instagram: Joi.string().uri().messages({
        'string.base': 'Liên kết instagram phải là một chuỗi văn bản.',
        'string.uri': 'Liên kết instagram phải là một địa chỉ web hợp lệ.',
    }),
    FanpageFb: Joi.string().uri().messages({
        'string.base': 'Liên kết facebook phải là một chuỗi văn bản.',
        'string.uri': 'Liên kết facebook phải là một địa chỉ web hợp lệ.',
    }),
    Tiktok: Joi.string().uri().messages({
        'string.base': 'Liên kết tiktok phải là một chuỗi văn bản.',
        'string.uri': 'Liên kết tiktok phải là một địa chỉ web hợp lệ.',
    }),
    Youtube: Joi.string().uri().messages({
        'string.base': 'Liên kết youtube phải là một chuỗi văn bản.',
        'string.uri': 'Liên kết youtube phải là một địa chỉ web hợp lệ.',
    }),
    ZaloWeb: Joi.string().uri().messages({
        'string.base': 'Liên kết zalo web phải là một chuỗi văn bản.',
        'string.uri': 'Liên kết zalo web phải là một địa chỉ web hợp lệ.',
    }),
    LinkWebConnect: Joi.string().uri().messages({
        'string.base': 'Liên kết web kết nối phải là một chuỗi văn bản.',
        'string.uri': 'Liên kết web kết nối phải là một địa chỉ web hợp lệ.',
    }),
});

export const UPDATE_WEB = Joi.object({
    nameCompany: Joi.string().trim().min(1).messages({
        'string.base': 'Tên công ty phải là một chuỗi văn bản.',
        'string.empty': 'Tên công ty không được để trống.',
    }),
    website: Joi.string().uri().messages({ // Giả sử 'link' là một URI hợp lệ
        'string.base': 'Website phải là một chuỗi văn bản.',
        'string.empty': 'Website không được để trống.',
        'string.uri': 'Website phải là một địa chỉ web hợp lệ.',
    }),
    address: Joi.string().messages({ // Giả sử 'address' là một chuỗi địa chỉ đơn giản
        'string.base': 'Địa chỉ phải là một chuỗi văn bản.',
        'string.empty': 'Địa chỉ không được để trống.',
    }),
    email: Joi.string().email().messages({
        'string.base': 'Email phải là một chuỗi văn bản.',
        'string.email': 'Email không hợp lệ.',
    }),
    phone: Joi.string()
        .pattern(/^[0-9]+$/) // Chỉ cho phép số
        .messages({
            'string.base': 'Số điện thoại phải là một chuỗi văn bản.',
            'string.empty': 'Số điện thoại không được để trống.',
            'string.pattern.base': 'Số điện thoại chỉ được chứa các chữ số.',
        }),
    zalo: Joi.string().messages({
        'string.base': 'Zalo phải là một chuỗi văn bản.',
    }),
    logo: Joi.string().messages({ // Giả sử 'media' là một đường dẫn hoặc tên tệp
        'string.base': 'Logo phải là một chuỗi văn bản.',
        'string.empty': 'Logo không được để trống.',
    }),
    nameBank: Joi.string().messages({
        'string.base': 'Tên ngân hàng phải là một chuỗi văn bản.',
    }),
    numberBank: Joi.string()
        .pattern(/^[0-9]+$/) // Chỉ cho phép số
        .messages({
            'string.base': 'Số tài khoản ngân hàng phải là một chuỗi văn bản.',
            'string.pattern.base': 'Số tài khoản ngân hàng chỉ được chứa các chữ số.',
        }),
    nameholderBank: Joi.string().messages({
        'string.base': 'Tên chủ tài khoản ngân hàng phải là một chuỗi văn bản.',
    }),
    hotline: Joi.string()
        .pattern(/^[0-9]+$/) // Chỉ cho phép số
        .messages({
            'string.base': 'Hotline phải là một chuỗi văn bản.',
            'string.pattern.base': 'Hotline chỉ được chứa các chữ số.',
        }),
    linkGoogleMaps: Joi.string().uri().messages({
        'string.base': 'Liên kết Google Maps phải là một chuỗi văn bản.',
        'string.uri': 'Liên kết Google Maps phải là một địa chỉ web hợp lệ.',
    }),
    Instagram: Joi.string().uri().messages({
        'string.base': 'Liên kết instagram phải là một chuỗi văn bản.',
        'string.uri': 'Liên kết instagram phải là một địa chỉ web hợp lệ.',
    }),
    FanpageFb: Joi.string().uri().messages({
        'string.base': 'Liên kết facebook phải là một chuỗi văn bản.',
        'string.uri': 'Liên kết facebook phải là một địa chỉ web hợp lệ.',
    }),
    Tiktok: Joi.string().uri().messages({
        'string.base': 'Liên kết tiktok phải là một chuỗi văn bản.',
        'string.uri': 'Liên kết tiktok phải là một địa chỉ web hợp lệ.',
    }),
    Youtube: Joi.string().uri().messages({
        'string.base': 'Liên kết youtube phải là một chuỗi văn bản.',
        'string.uri': 'Liên kết youtube phải là một địa chỉ web hợp lệ.',
    }),
    ZaloWeb: Joi.string().uri().messages({
        'string.base': 'Liên kết zalo web phải là một chuỗi văn bản.',
        'string.uri': 'Liên kết zalo web phải là một địa chỉ web hợp lệ.',
    }),
    LinkWebConnect: Joi.string().uri().messages({
        'string.base': 'Liên kết web kết nối phải là một chuỗi văn bản.',
        'string.uri': 'Liên kết web kết nối phải là một địa chỉ web hợp lệ.',
    }),
});