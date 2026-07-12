const advisorApplicationService = require('../services/advisorApplicationService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.createApplication = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const data = req.body;

  const application = await advisorApplicationService.createApplication(
    userId,
    data
  );

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

exports.getAllApplications = asyncHandler(async (req, res) => {
  const applications = await advisorApplicationService.getAllApplications();

  return sendSuccess(res, {
    message: 'Applications retrieved successfully',
    data: applications,
  });
});

exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, rejectReason } = req.body;
  const reviewerId = req.user.id;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const updatedApp = await advisorApplicationService.updateApplicationStatus(
    id,
    status,
    reviewerId,
    rejectReason
  );

  return sendSuccess(res, {
    message: `Application ${status.toLowerCase()} successfully`,
    data: updatedApp,
  });
});
