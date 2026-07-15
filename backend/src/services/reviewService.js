const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');
const reviewRepository = require('../repositories/reviewRepository');
const roadmapRepository = require('../repositories/roadmapRepository');

const MSG = {
  notFound: 'Review not found',
  roadmapNotFound: 'Learning path not found',
  notEnrolled: 'You must enroll in this learning path to submit a review',
  alreadyReviewed: 'You have already reviewed this learning path',
  forbidden: 'You do not have permission to perform this action',
  notMentor: 'Only the author of the learning path can reply to this review',
  alreadyReplied: 'You have already replied to this review',
};

// --- MENTEE ACTIONS ---

exports.createReview = async (userId, learningPathId, { rating, comment }) => {
  const roadmap = await roadmapRepository.findById(learningPathId);
  if (!roadmap) throw new ApiError(404, MSG.roadmapNotFound);

  // Check enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      learningPathId,
      isDeleted: false,
      status: { not: 'DROPPED' },
    },
  });

  if (!enrollment) throw new ApiError(403, MSG.notEnrolled);

  // Check if already reviewed (including soft-deleted ones)
  const existingReview = await prisma.review.findFirst({
    where: { userId, learningPathId }
  });

  if (existingReview) {
    if (!existingReview.isDeleted) {
      throw new ApiError(400, MSG.alreadyReviewed);
    } else {
      // Restore the soft-deleted review instead of creating a new one
      return reviewRepository.update(existingReview.id, {
        rating,
        comment,
        isDeleted: false,
        mentorReply: null, // Clear old mentor reply if any
        mentorReplyAt: null
      });
    }
  }

  return reviewRepository.create({
    userId,
    learningPathId,
    rating,
    comment,
  });
};

exports.updateReview = async (reviewId, userId, { rating, comment }) => {
  const review = await reviewRepository.findById(reviewId);
  if (!review) throw new ApiError(404, MSG.notFound);

  if (review.userId !== userId) throw new ApiError(403, MSG.forbidden);

  const updateData = {};
  if (rating !== undefined) updateData.rating = rating;
  if (comment !== undefined) updateData.comment = comment;

  return reviewRepository.update(reviewId, updateData);
};

exports.deleteReview = async (reviewId, userId) => {
  const review = await reviewRepository.findById(reviewId);
  if (!review) throw new ApiError(404, MSG.notFound);

  if (review.userId !== userId) throw new ApiError(403, MSG.forbidden);

  return reviewRepository.softDelete(reviewId);
};

// --- MENTOR ACTIONS ---

exports.createMentorReply = async (reviewId, mentorId, { mentorReply }) => {
  const review = await reviewRepository.findById(reviewId);
  if (!review) throw new ApiError(404, MSG.notFound);

  const roadmap = await roadmapRepository.findById(review.learningPathId);
  if (!roadmap) throw new ApiError(404, MSG.roadmapNotFound);

  if (roadmap.mentorId !== mentorId) throw new ApiError(403, MSG.notMentor);

  if (review.mentorReply) throw new ApiError(400, MSG.alreadyReplied);

  return reviewRepository.update(reviewId, {
    mentorReply,
    mentorReplyAt: new Date(),
  });
};

exports.updateMentorReply = async (reviewId, mentorId, { mentorReply }) => {
  const review = await reviewRepository.findById(reviewId);
  if (!review) throw new ApiError(404, MSG.notFound);

  const roadmap = await roadmapRepository.findById(review.learningPathId);
  if (!roadmap) throw new ApiError(404, MSG.roadmapNotFound);

  if (roadmap.mentorId !== mentorId) throw new ApiError(403, MSG.notMentor);

  return reviewRepository.update(reviewId, {
    mentorReply,
    mentorReplyAt: new Date(),
  });
};

exports.deleteMentorReply = async (reviewId, mentorId) => {
  const review = await reviewRepository.findById(reviewId);
  if (!review) throw new ApiError(404, MSG.notFound);

  const roadmap = await roadmapRepository.findById(review.learningPathId);
  if (!roadmap) throw new ApiError(404, MSG.roadmapNotFound);

  if (roadmap.mentorId !== mentorId) throw new ApiError(403, MSG.notMentor);

  return reviewRepository.update(reviewId, {
    mentorReply: null,
    mentorReplyAt: null,
  });
};

// --- PUBLIC/SHARED ACTIONS ---

exports.getReviewsByLearningPath = async (learningPathId, { skip = 0, take = 20 } = {}) => {
  const roadmap = await roadmapRepository.findById(learningPathId);
  if (!roadmap) throw new ApiError(404, MSG.roadmapNotFound);

  const [reviews, total] = await Promise.all([
    reviewRepository.findByLearningPathId(learningPathId, { skip, take }),
    reviewRepository.countByLearningPathId(learningPathId),
  ]);

  return { reviews, total };
};

exports.getMyReview = async (userId, learningPathId) => {
  const roadmap = await roadmapRepository.findById(learningPathId);
  if (!roadmap) throw new ApiError(404, MSG.roadmapNotFound);

  return reviewRepository.findByUserAndLearningPath(userId, learningPathId);
};
