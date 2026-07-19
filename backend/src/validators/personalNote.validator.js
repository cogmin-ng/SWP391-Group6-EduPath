const Joi = require('joi');

exports.listNotesQuerySchema = Joi.object({
  skip: Joi.number().integer().min(0).default(0),
  take: Joi.number().integer().min(1).max(100).default(50),
});

exports.saveNoteSchema = Joi.object({
  content: Joi.string().trim().min(1).max(10000).required().messages({
    'string.empty': 'Nội dung ghi chú không được để trống',
    'string.min': 'Nội dung ghi chú không được để trống',
    'string.max': 'Nội dung ghi chú không được vượt quá 10000 ký tự',
    'any.required': 'Nội dung ghi chú là bắt buộc',
  }),
});
