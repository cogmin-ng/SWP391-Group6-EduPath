const Joi = require('joi');

const bankQuestionOptionSchema = Joi.object({
  id: Joi.string().optional(),
  content: Joi.string().trim().required().messages({
    'string.empty': 'Option content is required',
  }),
  isCorrect: Joi.boolean().required(),
});

const createQuestionSchema = Joi.object({
  question: Joi.string().trim().required().messages({
    'string.empty': 'Question content is required',
  }),
  explanation: Joi.string().trim().allow('', null).optional(),
  difficulty: Joi.string().valid('DE', 'TRUNG_BINH', 'KHO').default('TRUNG_BINH'),
  subjectId: Joi.string().trim().required().messages({
    'string.empty': 'Subject ID is required',
  }),
  options: Joi.array()
    .items(bankQuestionOptionSchema)
    .min(2)
    .required()
    .messages({
      'array.min': 'A question must have at least 2 options',
    }),
}).custom((value, helpers) => {
  const correctCount = value.options.filter((opt) => opt.isCorrect).length;
  if (correctCount !== 1) {
    return helpers.message({ custom: 'A question must have exactly one correct option' });
  }
  return value;
});

const updateQuestionSchema = Joi.object({
  question: Joi.string().trim().optional(),
  explanation: Joi.string().trim().allow('', null).optional(),
  difficulty: Joi.string().valid('DE', 'TRUNG_BINH', 'KHO').optional(),
  subjectId: Joi.string().trim().optional(),
  options: Joi.array()
    .items(bankQuestionOptionSchema)
    .min(2)
    .optional(),
}).custom((value, helpers) => {
  if (value.options) {
    const correctCount = value.options.filter((opt) => opt.isCorrect).length;
    if (correctCount !== 1) {
      return helpers.message({ custom: 'A question must have exactly one correct option' });
    }
  }
  return value;
});

module.exports = {
  createQuestionSchema,
  updateQuestionSchema,
};
