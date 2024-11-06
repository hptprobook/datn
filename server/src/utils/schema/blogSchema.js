/* eslint-disable comma-dangle */
import Joi from 'joi';
export const SAVE_BLOG = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.base': 'Tiêu đề phải là một chuỗi văn bản.',
    'string.empty': 'Tiêu đề không được để trống.',
    'any.required': 'Tiêu đề là bắt buộc.',
  }),
  content: Joi.string().trim().required().messages({
    'string.base': 'Nội dung phải là một chuỗi văn bản.',
    'string.empty': 'Nội dung không được để trống.',
    'any.required': 'Nội dung là bắt buộc.',
  }),
  tags: Joi.array().default([]),
  // tags: Joi.string().trim().required().messages({
  //     'string.base': 'Tags phảỉ có kiểu dữ liệu là String.',
  //     'any.required': 'Tags là bắt buộc.',
  // }),
  authID: Joi.string().required().messages({
    'string.base': 'ID tác giả phải là một chuỗi.',
    'any.required': 'ID tác giả là bắt buộc.',
  }),
  authName: Joi.string().trim().required().messages({
    'string.base': 'Tên tác giả phải là một chuỗi văn bản.',
    'string.empty': 'Tên tác giả không được để trống.',
    'any.required': 'Tên tác giả là bắt buộc.',
  }),
  slug: Joi.string().trim().required().messages({
    'string.base': 'Slug phải là một chuỗi văn bản.',
    'string.empty': 'Slug không được để trống.',
    'any.required': 'Slug là bắt buộc.',
  }),
  thumbnail: Joi.string().required().messages({
    'string.base': 'Thumnail phải là một chuỗi văn bản.',
    'string.empty': 'Thumnail không được để trống.',
    'any.required': 'Thumnail là bắt buộc.',
  }),
  comments: Joi.array().default([]),
  status: Joi.string()
    .valid('public', 'private', 'waiting', 'reject')
    .default('waiting')
    .messages({
      'string.base': 'Trạng thái phải là một chuỗi.',
      'any.only':
        'Trạng thái chỉ có thể là public, private, waiting hoặc reject.',
    }),
  metaDescription: Joi.string().trim().messages({
    'string.base': 'Meta description phải là một chuỗi văn bản.',
    'string.empty': 'Meta description không được để trống.',
  }),
  metaKeywords: Joi.string().trim().messages({
    'string.base': 'Meta keywords phải là một chuỗi văn bản.',
    'string.empty': 'Meta keywords không được để trống.',
  }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_BLOG = Joi.object({
  title: Joi.string().trim().messages({
    'string.base': 'Tiêu đề phải là một chuỗi văn bản.',
    'string.empty': 'Tiêu đề không được để trống.',
  }),
  content: Joi.string().trim().messages({
    'string.base': 'Nội dung phải là một chuỗi văn bản.',
    'string.empty': 'Nội dung không được để trống.',
  }),
  authID: Joi.string().required().messages({
    'string.base': 'ID tác giả phải là một chuỗi.',
    'any.required': 'ID tác giả là bắt buộc.',
  }),
  authName: Joi.string().trim().required().messages({
    'string.base': 'Tên tác giả phải là một chuỗi văn bản.',
    'string.empty': 'Tên tác giả không được để trống.',
    'any.required': 'Tên tác giả là bắt buộc.',
  }),
  tags: Joi.array().default([]),
  // tags: Joi.string().trim().messages({
  //     'string.base': 'Tags phải là một chuỗi.',
  // }),
  slug: Joi.string().trim().messages({
    'string.base': 'Slug phải là một chuỗi văn bản.',
    'string.empty': 'Slug không được để trống.',
  }),
  thumbnail: Joi.string().messages({
    'string.base': 'Thumnail phải là một chuỗi văn bản.',
    'string.empty': 'Thumnail không được để trống.',
  }),
  status: Joi.string()
    .valid('public', 'private', 'waiting', 'reject')
    .messages({
      'string.base': 'Trạng thái phải là một chuỗi.',
      'any.only':
        'Trạng thái chỉ có thể là public, private, waiting hoặc reject.',
    }),
  metaDescription: Joi.string().trim().messages({
    'string.base': 'Meta description phải là một chuỗi văn bản.',
    'string.empty': 'Meta description không được để trống.',
  }),
  metaKeywords: Joi.string().trim().messages({
    'string.base': 'Meta keywords phải là một chuỗi văn bản.',
    'string.empty': 'Meta keywords không được để trống.',
  }),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

export const UPDATE_COMMENT = Joi.object({
  commentId: Joi.string().messages({
    'string.base': 'comment ID phải là một chuỗi.',
    'string.empty': 'comment ID không được để trống.',
  }),
  userId: Joi.string().messages({
    'string.base': 'User ID phải là một chuỗi.',
    'string.empty': 'User ID không được để trống.',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Email phải đúng định dạng.',
    'string.empty': 'Email không được để trống.',
  }),
  name: Joi.string().trim().messages({
    'string.base': 'Tên phải là một chuỗi văn bản.',
    'string.empty': 'Tên không được để trống.',
  }),
  comment: Joi.string().trim().messages({
    'string.base': 'Bình luận phải là một chuỗi văn bản.',
    'string.empty': 'Bình luận không được để trống.',
  }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
});
