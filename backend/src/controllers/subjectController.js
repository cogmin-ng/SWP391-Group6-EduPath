const subjectService = require('../services/subjectService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.getAll = asyncHandler(async (req, res) => {
  const { categoryId, availableForMentor } = req.query;
  const excludeUserId = availableForMentor === 'true' ? req.user?.id : null;
  const subjects = await subjectService.getAllSubjects(categoryId, excludeUserId);

  return sendSuccess(res, {
    message: 'Subjects retrieved successfully',
    data: subjects,
  });
});
