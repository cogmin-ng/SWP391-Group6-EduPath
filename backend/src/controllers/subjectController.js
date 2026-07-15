const subjectService = require('../services/subjectService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');
const ApiError = require('../utils/ApiError');
const Joi = require('joi');

const createSchema = Joi.object({
  name: Joi.string().required().trim().max(100),
  description: Joi.string().allow('', null).trim().max(500),
  categoryId: Joi.string().required(),
});

const updateSchema = Joi.object({
  name: Joi.string().optional().trim().max(100),
  description: Joi.string().allow('', null).trim().max(500),
  categoryId: Joi.string().optional(),
});

exports.getAll = asyncHandler(async (req, res) => {
  const { categoryId, availableForMentor } = req.query;
  const excludeUserId = availableForMentor === 'true' ? req.user?.id : null;
  const subjects = await subjectService.getAllSubjects(categoryId, excludeUserId);

  return sendSuccess(res, {
    message: 'Subjects retrieved successfully',
    data: subjects,
  });
});

exports.create = asyncHandler(async (req, res) => {
  const { error, value } = createSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const subject = await subjectService.createSubject(value);
  return sendSuccess(res, {
    statusCode: 201,
    message: 'Subject created successfully',
    data: subject,
  });
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const subject = await subjectService.updateSubject(id, value);
  return sendSuccess(res, {
    message: 'Subject updated successfully',
    data: subject,
  });
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await subjectService.deleteSubject(id);
  return sendSuccess(res, {
    message: 'Subject deleted successfully',
  });
});
