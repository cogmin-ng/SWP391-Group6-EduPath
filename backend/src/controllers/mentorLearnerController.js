const mentorLearnerService = require('../services/mentorLearnerService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.getLearners = asyncHandler(async (req, res) => {
  const result = await mentorLearnerService.getLearners(req.user.id, req.query);

  return sendSuccess(res, {
    message: 'Mentor learners retrieved successfully',
    data: result,
  });
});

exports.sendReminder = asyncHandler(async (req, res) => {
  const result = await mentorLearnerService.sendReminder(
    req.user.id,
    req.params.enrollmentId,
    req.body
  );

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Reminder sent successfully',
    data: result,
  });
});
