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
