const Joi = require('joi');

const createAdvisorApplicationSchema = Joi.object({
  specialization: Joi.string().trim().required().messages({
    'string.empty': 'Specialization is required',
    'any.required': 'Specialization is required',
  }),
  currentSemester: Joi.string().trim().required().messages({
    'string.empty': 'Current semester is required',
    'any.required': 'Current semester is required',
  }),
  bio: Joi.string().trim().min(30).required().messages({
    'string.empty': 'Bio is required',
    'string.min': 'Bio must be at least 30 characters',
    'any.required': 'Bio is required',
  }),
  experience: Joi.string().trim().min(10).required().messages({
    'string.empty': 'Experience is required',
    'string.min': 'Experience must be at least 10 characters',
    'any.required': 'Experience is required',
  }),
  transcriptUrl: Joi.string().uri().optional().allow('', null),
  subjectIds: Joi.array()
    .items(Joi.string().trim().required())
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one subject is required',
      'any.required': 'Subjects are required',
    }),
  academicRecords: Joi.array()
    .items(
      Joi.object({
        subjectId: Joi.string().trim().required().messages({
          'string.empty': 'Subject is required for academic record',
          'any.required': 'Subject is required for academic record',
        }),
        grade: Joi.number().min(0).max(10).required().messages({
          'number.base': 'Grade must be a number',
          'number.min': 'Grade must be at least 0',
          'number.max': 'Grade must be at most 10',
          'any.required': 'Grade is required',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one academic record is required',
      'any.required': 'Academic records are required',
    }),
});

module.exports = {
  createAdvisorApplicationSchema,
};
