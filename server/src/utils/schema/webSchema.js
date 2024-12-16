const Joi = require('joi');

// Schema cơ sở
const baseSchema = Joi.object({
    nameCompany: Joi.string().trim().min(1).messages({
        'string.base': 'Tên công ty phải là một chuỗi văn bản.',
        'string.empty': 'Tên công ty không được để trống.',
    }),
    website: Joi.string().uri().messages({
        'string.base': 'Website phải là một chuỗi văn bản.',
        'string.uri': 'Website phải là một địa chỉ web hợp lệ.',
    }),
    address: Joi.string().messages({
        'string.base': 'Địa chỉ phải là một chuỗi văn bản.',
        'string.empty': 'Địa chỉ không được để trống.',
    }),
    email: Joi.string().email().messages({
        'string.base': 'Email phải là một chuỗi văn bản.',
        'string.email': 'Email không hợp lệ.',
    }),
    phone: Joi.string()
        .pattern(/^[0-9]+$/)
        .messages({
            'string.base': 'Số điện thoại phải là một chuỗi văn bản.',
            'string.pattern.base': 'Số điện thoại chỉ được chứa các chữ số.',
        }),
    zalo: Joi.string().pattern(/^[0-9]+$/).messages({
        'string.base': 'Zalo phải là một chuỗi văn bản.',
        'string.pattern.base': 'Zalo chỉ được chứa các chữ số.',
    }),
    logo: Joi.string().messages({
        'string.base': 'Logo phải là một chuỗi văn bản.',
        'string.empty': 'Logo không được để trống.',
    }),
    icon: Joi.string().messages({
        'string.base': 'Logo phải là một chuỗi văn bản.',
        'string.empty': 'Logo không được để trống.',
    }),
    darkLogo: Joi.string().messages({
        'string.base': 'Logo tối phải là một chuỗi văn bản.',
    }),
    loginScreen: Joi.string().messages({
        'string.base': 'Màn hình đăng nhập tối phải là một chuỗi văn bản.',
    }),
    eventBanner: Joi.string().messages({
        'string.base': 'Banner sự kiện phải là một chuỗi văn bản.',
    }),
    eventUrl: Joi.string().messages({
        'string.base': 'Liên kết sự kiện phải là một chuỗi văn bản.',
    }),
    nameBank: Joi.string().messages({
        'string.base': 'Tên ngân hàng phải là một chuỗi văn bản.',
    }),
    numberBank: Joi.string().pattern(/^[0-9]+$/).messages({
        'string.base': 'Số tài khoản ngân hàng phải là một chuỗi văn bản.',
        'string.pattern.base': 'Số tài khoản ngân hàng chỉ được chứa các chữ số.',
    }),
    nameholderBank: Joi.string().messages({
        'string.base': 'Tên chủ tài khoản ngân hàng phải là một chuỗi văn bản.',
    }),
    hotline: Joi.string().pattern(/^[0-9]+$/).messages({
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
    footerThanks: Joi.string().min(50).max(1000).messages({
        'string.base': 'Lời cảm ơn phải là một chuỗi văn bản.',
        'string.min': 'Lời cảm ơn phải có ít nhất {#limit} ký tự.',
        'string.max': 'Lời cảm ơn không được vượt quá {#limit} ký tự.',
    }),
    ggSearchConsole: Joi.string().messages({
        'string.base': 'Google Search Console phải là một chuỗi văn bản.',
    }),
    metaTitle: Joi.string()
        .trim()
        .min(1)
        .messages({
            'string.base': 'Tiêu đề meta phải là một chuỗi văn bản.',
            'string.empty': 'Tiêu đề meta không được để trống.',
            'string.min': 'Tiêu đề meta phải có ít nhất {#limit} ký tự.',
        }),
    metaDescription: Joi.string()
        .trim()
        .messages({
            'string.base': 'Mô tả meta phải là một chuỗi văn bản.',
            'string.min': 'Mô tả meta phải có ít nhất {#limit} ký tự.',
        }),
    metaKeywords: Joi.string()
        .messages({
            'string.base': 'Từ khóa meta phải là một chuỗi văn bản.',
        }),
    metaRobots: Joi.string()
        .valid('index', 'noindex', 'follow', 'nofollow')
        .default('index')
        .trim()
        .not()
        .empty()
        .messages({
            'string.base': 'Meta robots phải là một chuỗi văn bản.',
            'string.empty': 'Meta robots không được để trống.',
            'any.only': 'Meta robots phải là một trong các giá trị sau: index, noindex, follow, nofollow.',
        }),
    metaOGImg: Joi.string()
        .trim()
        .min(1)
        .messages({
            'string.base': 'Hình ảnh OG meta phải là một chuỗi văn bản.',
            'string.empty': 'Hình ảnh OG meta không được để trống.',
            'string.min': 'Hình ảnh OG meta phải có ít nhất {#limit} ký tự.',
        }),
});

// Tạo schema cho CREATE_WEB với các trường bắt buộc
export const CREATE_WEB = baseSchema.fork(
    ['nameCompany', 'website', 'address', 'phone', 'zalo', 'logo', 'icon', 'footerThanks'],
    (schema) => schema.required()
);

// Tạo schema cho UPDATE_WEB, không cần các trường bắt buộc
export const UPDATE_WEB = baseSchema;
