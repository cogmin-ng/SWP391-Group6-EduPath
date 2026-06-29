const subjectCategoryService = require('../services/subjectCategoryService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.getAll = asyncHandler(async (req, res) => {
  const categories = await subjectCategoryService.getAllCategories();

  return sendSuccess(res, {
    message: 'Subject categories retrieved successfully',
    data: categories,
  });
});
