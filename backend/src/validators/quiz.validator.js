const Joi = require('joi');

const quizOptionSchema = Joi.object({
  content: Joi.string().trim().required().messages({
    'string.empty': 'Option content is required',
    'any.required': 'Option content is required',
  }),
  isCorrect: Joi.boolean().required().messages({
    'any.required': 'isCorrect is required',
  }),
});

const quizQuestionSchema = Joi.object({
  question: Joi.string().trim().required().messages({
    'string.empty': 'Question text is required',
    'any.required': 'Question text is required',
  }),
  explanation: Joi.string().trim().allow('', null).optional(),
  options: Joi.array()
    .items(quizOptionSchema)
    .min(2)
    .required()
    .custom((options, helpers) => {
      const correctCount = options.filter((opt) => opt.isCorrect).length;
      if (correctCount !== 1) {
        return helpers.error('any.custom', {
          message: 'Each question must have exactly 1 correct answer',
        });
      }
      return options;
    })
    .messages({
      'array.min': 'Each question must have at least 2 options',
      'any.required': 'Options are required',
      'any.custom': '{{#message}}',
    }),
});

const createQuizSchema = Joi.object({
  nodeId: Joi.string().required().messages({
    'string.empty': 'Node ID is required',
    'any.required': 'Node ID is required',
  }),
  title: Joi.string().trim().required().messages({
    'string.empty': 'Quiz title is required',
    'any.required': 'Quiz title is required',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  passingScore: Joi.number().integer().greater(0).required().messages({
    'number.greater': 'Passing score must be greater than 0',
    'any.required': 'Passing score is required',
  }),
  xpReward: Joi.number().integer().min(0).default(50).messages({
    'number.min': 'XP reward must be 0 or greater',
  }),
  questions: Joi.array().items(quizQuestionSchema).min(1).required().messages({
    'array.min': 'Quiz must have at least 1 question',
    'any.required': 'Questions are required',
  }),
});

const updateQuizSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Quiz title is required',
    'any.required': 'Quiz title is required',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  passingScore: Joi.number().integer().greater(0).required().messages({
    'number.greater': 'Passing score must be greater than 0',
    'any.required': 'Passing score is required',
  }),
  xpReward: Joi.number().integer().min(0).default(50).messages({
    'number.min': 'XP reward must be 0 or greater',
  }),
  questions: Joi.array().items(quizQuestionSchema).min(1).required().messages({
    'array.min': 'Quiz must have at least 1 question',
    'any.required': 'Questions are required',
  }),
});

module.exports = {
  createQuizSchema,
  updateQuizSchema,
};
