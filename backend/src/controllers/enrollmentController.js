const enrollmentService = require('../services/enrollmentService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.enrollBySlug = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.enrollBySlug(
    req.params.slug,
    req.user.id
  );

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Enrolled successfully',
    data: enrollment,
  });
});

exports.getMyEnrollmentBySlug = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.getMyEnrollmentBySlug(
    req.params.slug,
    req.user.id
  );

  return sendSuccess(res, {
    message: 'Enrollment retrieved successfully',
    data: enrollment,
  });
});

exports.updateEnrollmentProgressBySlug = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.updateEnrollmentProgressBySlug(
    req.params.slug,
    req.user.id,
    req.body.progressPercent
  );

  return sendSuccess(res, {
    message: 'Enrollment progress updated successfully',
    data: enrollment,
  });
});
