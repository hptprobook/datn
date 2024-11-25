const Joi = require('joi');

export const CREATE_COUPON_USAGE_HISTORY = Joi.object({
  userId: Joi.string().trim().required().messages({
    'string.base': 'ID người dùng phải là một chuỗi văn bản.',
    'string.empty': 'ID người dùng không được để trống.',
    'any.required': 'ID người dùng là bắt buộc.',
  }),
  couponId: Joi.string().trim().required().messages({
    'string.base': 'ID coupon phải là một chuỗi văn bản.',
    'string.empty': 'ID coupon không được để trống.',
    'any.required': 'ID coupon là bắt buộc.',
  }),
  orderId: Joi.string().trim().allow(null).messages({
    'string.base': 'ID đơn hàng phải là một chuỗi văn bản.',
    'string.empty': 'ID đơn hàng không được để trống.',
  }),
  code: Joi.string().trim().required().messages({
    'string.base': 'Mã giảm giá phải là một chuỗi văn bản.',
    'string.empty': 'Mã giảm giá không được là trống.',
    'any.required': 'Mã giảm giá là bắt buộc.',
  }),
  usageDate: Joi.date().timestamp('javascript').default(Date.now).messages({
    'date.base': 'Ngày sử dụng phải là một ngày hợp lệ.',
  }),
  discountAmount: Joi.number().min(0).messages({
    'number.base': 'Số tiền giảm giá phải là một số.',
    'number.min': 'Số tiền giảm giá phải lớn hơn hoặc bằng {#limit}.',
  }),
  status: Joi.string()
    .trim()
    .valid('successful', 'failed')
    .default('successful')
    .messages({
      'string.base': 'Trạng thái phải là một chuỗi văn bản.',
      'any.only':
        'Trạng thái phải là một trong các giá trị sau: successful, failed.',
    }),
});
