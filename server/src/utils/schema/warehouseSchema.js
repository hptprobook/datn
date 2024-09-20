import Joi from 'joi';

export const SAVE_WAREHOUSES = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Tên không được để trống',
    'any.required': 'Tên là bắt buộc',
  }),
  location: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Địa chỉ không được để trống',
    'any.required': 'Địa chỉ là bắt buộc',
  }),
  status: Joi.boolean().required().messages({
    'any.required': 'Trạng thái là bắt buộc',
  }),
  capacity: Joi.number().integer().required().messages({
    'string.empty': 'Sức chứa không được để trống',
    'any.required': 'Sức chứa là bắt buộc',
  }),
  currentInventory: Joi.number().integer().default(0),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
export const UPDATE_WAREHOUSES = Joi.object({
  name: Joi.string().trim().min(1).messages({
    'string.empty': 'Tên không được để trống',
  }),
  location: Joi.string().trim().min(1).messages({
    'string.empty': 'Địa chỉ không được để trống',
  }),
  status: Joi.boolean(),
  capacity: Joi.number().integer().required().messages({
    'string.empty': 'Sức chứa không được để trống',
  }),
  currentInventory: Joi.number().integer().default(0),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});
