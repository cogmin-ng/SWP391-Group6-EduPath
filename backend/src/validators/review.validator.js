const Joi = require('joi');

const createReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Rating must be a number',
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating must be at most 5',
    'any.required': 'Rating is required',
  }),
  comment: Joi.string().trim().max(1000).allow('', null).optional().messages({
    'string.max': 'Comment cannot exceed 1000 characters',
  }),
});

const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().trim().max(1000).allow('', null).optional(),
});

const mentorReplySchema = Joi.object({
  mentorReply: Joi.string().trim().max(2000).required().messages({
    'string.empty': 'Reply content cannot be empty',
    'any.required': 'Reply content is required',
    'string.max': 'Reply cannot exceed 2000 characters',
  }),
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
  mentorReplySchema,
};
