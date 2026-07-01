const subjectCategoryService = require('../services/subjectCategoryService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');
const ApiError = require('../utils/ApiError');
const Joi = require('joi');

const createSchema = Joi.object({
  name: Joi.string().required().trim().max(100),
  description: Joi.string().allow('', null).trim().max(500),
});

const updateSchema = Joi.object({
  name: Joi.string().optional().trim().max(100),
  description: Joi.string().allow('', null).trim().max(500),
});

exports.getAll = asyncHandler(async (req, res) => {
  const categories = await subjectCategoryService.getAllCategories();

  return sendSuccess(res, {
    message: 'Subject categories retrieved successfully',
    data: categories,
  });
});

exports.create = asyncHandler(async (req, res) => {
  const { error, value } = createSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const category = await subjectCategoryService.createCategory(value);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Subject category created successfully',
    data: category,
  });
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const category = await subjectCategoryService.updateCategory(id, value);

  return sendSuccess(res, {
    message: 'Subject category updated successfully',
    data: category,
  });
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await subjectCategoryService.deleteCategory(id);

  return sendSuccess(res, {
    message: 'Subject category deleted successfully',
  });
});
