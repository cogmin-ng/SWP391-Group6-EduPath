const Joi = require('joi');

const createCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required().messages({
    'string.empty': 'Nội dung bình luận không được để trống',
    'string.min': 'Nội dung bình luận không được để trống',
    'string.max': 'Nội dung bình luận không được vượt quá 2000 ký tự',
    'any.required': 'Nội dung bình luận là bắt buộc',
  }),
});

const updateCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required().messages({
    'string.empty': 'Nội dung bình luận không được để trống',
    'string.min': 'Nội dung bình luận không được để trống',
    'string.max': 'Nội dung bình luận không được vượt quá 2000 ký tự',
    'any.required': 'Nội dung bình luận là bắt buộc',
  }),
});

const createReplySchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required().messages({
    'string.empty': 'Nội dung trả lời không được để trống',
    'string.min': 'Nội dung trả lời không được để trống',
    'string.max': 'Nội dung trả lời không được vượt quá 2000 ký tự',
    'any.required': 'Nội dung trả lời là bắt buộc',
  }),
});

module.exports = {
  createCommentSchema,
  updateCommentSchema,
  createReplySchema,
};
