
import Joi from 'joi';

export const TIMETABLE_SCHEMA = Joi.object({
    type: Joi.string()
        .valid('morning', 'afternoon', 'evening', 'night', 'all')
        .messages({
            'any.only': 'Ca làm không hợp lệ'
        }).default('morning'),
    status: Joi.string().valid('pending', 'checked', 'doing', 'complete').default('pending'),
    date: Joi.date().timestamp('javascript').default(Date.now),
    startTime: Joi.date().timestamp('javascript').messages({
        'date.base': 'Thời gian bắt đầu không hợp lệ'
    }),
    endTime: Joi.date().timestamp('javascript')
        .messages({
            'date.base': 'Thời gian kết thúc không hợp lệ'
        }),
    staffId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.pattern.base': 'ID nhân viên không hợp lệ'
        }),
    branchId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.pattern.base': 'ID chi nhánh không hợp lệ'
        }),
    note: Joi.string().max(500)
        .messages({
            'string.max': 'Ghi chú không được vượt quá 500 ký tự',
        }),
})