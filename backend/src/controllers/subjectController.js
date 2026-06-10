const subjectService = require('../services/subjectService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.getAll = asyncHandler(async (req, res) => {
  const subjects = await subjectService.getAllSubjects();

  return sendSuccess(res, {
    message: 'Subjects retrieved successfully',
    data: subjects,
  });
});
