const majorService = require('../services/majorService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.getAll = asyncHandler(async (req, res) => {
  const majors = await majorService.getAllMajors();
  return sendSuccess(res, {
    message: 'Majors retrieved successfully',
    data: majors,
  });
});
