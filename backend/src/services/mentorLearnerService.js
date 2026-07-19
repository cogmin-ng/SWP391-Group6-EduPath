const ApiError = require('../utils/ApiError');
const mentorLearnerRepository = require('../repositories/mentorLearnerRepository');
const notificationService = require('./notificationService');

function mapEnrollment(enrollment, learningDetails) {
  const { learningPath, user } = enrollment;
  const nodes = learningDetails?.nodes || [];
  const completedNodeIds = new Set(
    nodes
      .filter((node) =>
        node.nodeProgresses.some(
          (progress) => progress.userId === user.id && progress.completed
        )
      )
      .map((node) => node.id)
  );
  const currentNode =
    nodes.find((node) => !completedNodeIds.has(node.id)) ||
    nodes[nodes.length - 1] ||
    null;
  const quizzes = nodes.flatMap((node) => node.quizzes);
  const passedQuizCount = quizzes.filter((quiz) =>
    quiz.attempts.some((attempt) => attempt.userId === user.id)
  ).length;
  const certificate = learningDetails?.certificates.find(
    (item) => item.userId === user.id
  );

  return {
    enrollmentId: enrollment.id,
    learner: user,
    learningPath: { id: learningPath.id, title: learningPath.title },
    progressPercent: enrollment.progressPercent,
    status: enrollment.status,
    currentNode: currentNode
      ? {
          id: currentNode.id,
          title: currentNode.title,
          orderIndex: currentNode.orderIndex,
        }
      : null,
    quizzes: { completed: passedQuizCount, total: quizzes.length },
    certificate: certificate
      ? { status: 'ISSUED', id: certificate.id, issuedAt: certificate.issuedAt }
      : { status: 'NOT_ISSUED', id: null, issuedAt: null },
    lastActivityAt: enrollment.lastActivityAt,
    enrolledAt: enrollment.enrolledAt,
  };
}

exports.getLearners = async (mentorId, query) => {
  const { page, limit, search, status } = query;
  const skip = (page - 1) * limit;
  const [{ enrollments, total }, statsRows] = await Promise.all([
    mentorLearnerRepository.findPage(mentorId, {
      skip,
      take: limit,
      search,
      status,
    }),
    mentorLearnerRepository.findStatsRows(mentorId),
  ]);
  const learningDetails = await mentorLearnerRepository.findLearningDetails(
    [...new Set(enrollments.map((item) => item.learningPath.id))],
    [...new Set(enrollments.map((item) => item.user.id))]
  );
  const learningDetailsById = new Map(
    learningDetails.map((item) => [item.id, item])
  );

  const learnerIds = new Set(statsRows.map((item) => item.userId));
  const completedLearnerIds = new Set(
    statsRows
      .filter((item) => item.status === 'COMPLETED')
      .map((item) => item.userId)
  );

  return {
    learners: enrollments.map((enrollment) =>
      mapEnrollment(
        enrollment,
        learningDetailsById.get(enrollment.learningPath.id)
      )
    ),
    stats: {
      totalLearners: learnerIds.size,
      completedLearners: completedLearnerIds.size,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    },
  };
};

exports.sendReminder = async (mentorId, enrollmentId, payload) => {
  const enrollment = await mentorLearnerRepository.findOwnedEnrollment(
    enrollmentId,
    mentorId
  );

  if (!enrollment) {
    throw new ApiError(404, 'Learner enrollment not found');
  }

  const notification = await notificationService.createNotification(
    enrollment.userId,
    {
      type: 'ROADMAP',
      title: payload.title,
      content: payload.content,
    }
  );

  return {
    notification,
    learner: enrollment.user,
    learningPath: enrollment.learningPath,
  };
};
