const asyncHandler = require('../middleware/asyncHandler');
const menteeDashboardService = require('../services/menteeDashboardService');
const { sendSuccess } = require('../utils/response');

exports.getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await menteeDashboardService.getDashboard(req.user.id);

  return sendSuccess(res, {
    message: 'Mentee dashboard retrieved successfully',
    data: dashboard,
  });
});
