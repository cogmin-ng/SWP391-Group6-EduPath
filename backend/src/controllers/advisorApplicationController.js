const advisorApplicationService = require('../services/advisorApplicationService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.createApplication = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const data = req.body;

  const application = await advisorApplicationService.createApplication(userId, data);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Application submitted successfully',
    data: application,
  });
});

exports.getMyApplication = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const application = await advisorApplicationService.getMyApplication(userId);

  return sendSuccess(res, {
    message: 'Application retrieved successfully',
    data: application,
  });
});
