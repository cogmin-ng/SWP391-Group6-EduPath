const learningPathService = require('../services/learningPathService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.getExploreList = asyncHandler(async (req, res) => {
  const learningPaths = await learningPathService.getExploreLearningPaths();

  return sendSuccess(res, {
    message: 'Learning paths retrieved successfully',
    data: learningPaths,
  });
});

exports.getHotLearningPaths = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(Number.parseInt(req.query.limit, 10) || 9, 50));

  const result = await learningPathService.getHotLearningPaths({ page, limit });

  return sendSuccess(res, {
    message: 'Hot learning paths retrieved successfully',
    data: result,
  });
});
