const reviewService = require('../services/reviewService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.createReview = asyncHandler(async (req, res) => {
  const { learningPathId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  const review = await reviewService.createReview(userId, learningPathId, {
    rating,
    comment,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Review submitted successfully',
    data: review,
  });
});

exports.updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  const review = await reviewService.updateReview(id, userId, {
    rating,
    comment,
  });

  return sendSuccess(res, {
    message: 'Review updated successfully',
    data: review,
  });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  await reviewService.deleteReview(id, userId);

  return sendSuccess(res, {
    message: 'Review deleted successfully',
  });
});

exports.createMentorReply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { mentorReply } = req.body;
  const mentorId = req.user.id;

  const review = await reviewService.createMentorReply(id, mentorId, {
    mentorReply,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Reply submitted successfully',
    data: review,
  });
});

exports.updateMentorReply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { mentorReply } = req.body;
  const mentorId = req.user.id;

  const review = await reviewService.updateMentorReply(id, mentorId, {
    mentorReply,
  });

  return sendSuccess(res, {
    message: 'Reply updated successfully',
    data: review,
  });
});

exports.deleteMentorReply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const mentorId = req.user.id;

  await reviewService.deleteMentorReply(id, mentorId);

  return sendSuccess(res, {
    message: 'Reply deleted successfully',
  });
});

exports.getReviews = asyncHandler(async (req, res) => {
  const { learningPathId } = req.params;
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 20;

  const { reviews, total } = await reviewService.getReviewsByLearningPath(
    learningPathId,
    { skip, take: limit }
  );

  return sendSuccess(res, {
    message: 'Reviews retrieved successfully',
    data: { reviews, total },
  });
});

exports.getMyReview = asyncHandler(async (req, res) => {
  const { learningPathId } = req.params;
  const userId = req.user.id;

  const review = await reviewService.getMyReview(userId, learningPathId);

  return sendSuccess(res, {
    message: 'Your review retrieved successfully',
    data: review,
  });
});
