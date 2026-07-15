const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');
const roadmapRepository = require('../repositories/roadmapRepository');
const notificationService = require('./notificationService');
const {
  findLearningPathIdBySlug,
  toRoadmapSlug,
} = require('../utils/roadmapSlug');
const nodeRepository = require('../repositories/nodeRepository');
const {
  normalizeDurationParts,
  serializeDuration,
} = require('../utils/duration');

const MSG = {
  notFound: 'Roadmap not found',
  forbidden: 'You do not have permission to perform this action',
  subjectNotFound: 'Subject not found',
  cannotSubmit: 'Only DRAFT or REJECTED roadmaps can be submitted for review',
  cannotDelete:
    'Cannot delete a PUBLISHED roadmap. Archive it first or contact admin.',
};

const ACTIVE = { isDeleted: false };

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Resolve the subjectId to use when creating / updating a roadmap.
 * - If a valid subjectId is provided, validate it exists.
 * - Otherwise, pick the first available subject as a default.
 */
async function resolveSubjectId(subjectId) {
  if (subjectId) {
    const subject = await prisma.subject.findFirst({
      where: { id: subjectId, ...ACTIVE },
    });
    if (!subject) throw new ApiError(404, MSG.subjectNotFound);
    return subjectId;
  }

  // No subjectId provided – use the first available subject
  const fallback = await prisma.subject.findFirst({
    where: ACTIVE,
    orderBy: { name: 'asc' },
    select: { id: true },
  });
  if (!fallback) {
    throw new ApiError(
      500,
      'No subject exists in the database. Please seed subjects first.'
    );
  }
  return fallback.id;
}

/**
 * Assert the roadmap exists and belongs to the given mentor.
 */
async function assertOwnership(roadmapId, mentorId) {
  const roadmap = await roadmapRepository.findById(roadmapId);
  if (!roadmap) throw new ApiError(404, MSG.notFound);
  if (roadmap.mentorId !== mentorId) throw new ApiError(403, MSG.forbidden);
  return roadmap;
}

async function notifyAdminsAboutPendingRoadmap(tx, roadmap) {
  const admins = await tx.user.findMany({
    where: {
      role: { name: 'ADMIN' },
      isDeleted: false,
      status: 'ACTIVE',
    },
    select: { id: true },
  });

  if (admins.length > 0) {
    await notificationService.createNotifications(
      admins.map((admin) => admin.id),
      {
        type: 'ROADMAP',
        title: 'Lộ trình mới cần duyệt',
        content: `Mentor vừa gửi lộ trình "${roadmap.title}" để admin xem xét.`,
      },
      tx
    );
  }
}

async function notifyMentorAboutRoadmapReview(tx, roadmap, status, feedback) {
  const message =
    status === 'APPROVED'
      ? `Lộ trình "${roadmap.title}" của bạn đã được phê duyệt.`
      : `Lộ trình "${roadmap.title}" của bạn đã bị từ chối.${
          feedback ? ` Lý do: ${feedback}` : ''
        }`;

  await notificationService.createNotification(
    roadmap.mentorId,
    {
      type: 'ROADMAP',
      title:
        status === 'APPROVED'
          ? 'Lộ trình được phê duyệt'
          : 'Lộ trình bị từ chối',
      content: message,
    },
    tx
  );
}

// ---------------------------------------------------------------------------
// Service methods
// ---------------------------------------------------------------------------

/**
 * Create a new roadmap (with optional nodes) in a single transaction.
 */
exports.createRoadmap = async (data, mentorId) => {
  const resolvedTitle = data.title || data.name;
  const resolvedSubjectId = await resolveSubjectId(data.subjectId);

  const nodes = data.nodes || [];
  const normalizedNodes = nodes.map((node, idx) => {
    const durationParts = normalizeDurationParts(
      node.durationParts || node.duration
    );
    return {
      ...node,
      orderIndex: node.orderIndex !== undefined ? node.orderIndex : idx,
      duration: serializeDuration(durationParts),
      durationParts,
    };
  });

  const roadmapId = await prisma.$transaction(async (tx) => {
    const created = await roadmapRepository.create(
      {
        title: resolvedTitle,
        description: data.description || null,
        studyTips: data.studyTips || null,
        thumbnail: data.thumbnail || null,
        status: 'DRAFT',
        xpReward: data.xpReward ?? 0,
        mentor: { connect: { id: mentorId } },
        subject: { connect: { id: resolvedSubjectId } },
        nodes: {
          create: normalizedNodes.map((node) => ({
            title: node.title,
            description: node.description || null,
            orderIndex: node.orderIndex,
          })),
        },
      },
      tx
    );

    // Persist each node's detail (checklists & materials). Created nodes come
    // back ordered by orderIndex, matching the input node order.
    const createdNodes = [...(created.nodes || [])].sort(
      (a, b) => a.orderIndex - b.orderIndex
    );
    for (let i = 0; i < normalizedNodes.length; i++) {
      const input = normalizedNodes[i];
      const target = createdNodes[i];
      if (!target) continue;
      await tx.node.update({
        where: { id: target.id },
        data: {
          duration: input.duration || null,
          updatedAt: new Date(),
        },
      });

      if (Array.isArray(input.checklists)) {
        await nodeRepository.syncChecklists(target.id, input.checklists, tx);
      }
      if (Array.isArray(input.materials)) {
        await nodeRepository.syncMaterials(target.id, input.materials, tx);
      }
      if (Array.isArray(input.quizzes)) {
        await roadmapRepository.syncQuizzes(target.id, input.quizzes, tx);
      }
    }

    return created.id;
  });

  return roadmapRepository.findById(roadmapId);
};

/**
 * Get a single roadmap by ID.
 * DRAFT / PENDING roadmaps are only visible to the owning mentor or an admin.
 */
exports.getRoadmapById = async (roadmapId, userId, roles = []) => {
  const roadmap = await roadmapRepository.findById(roadmapId);
  if (!roadmap) throw new ApiError(404, MSG.notFound);

  const isOwner = roadmap.mentorId === userId;
  const isAdmin = roles.includes('ADMIN');
  const isPublic =
    roadmap.status === 'APPROVED' || roadmap.status === 'PUBLISHED';

  if (!isPublic && !isOwner && !isAdmin) {
    throw new ApiError(403, MSG.forbidden);
  }

  return roadmap;
};

exports.getRoadmapBySlug = async (slug, userId, roles = []) => {
  const roadmapId = await findLearningPathIdBySlug(slug);
  if (!roadmapId) throw new ApiError(404, MSG.notFound);

  const roadmap = await roadmapRepository.findById(roadmapId);
  if (!roadmap) throw new ApiError(404, MSG.notFound);

  let enrollment = null;
  let nodeProgresses = [];

  if (userId) {
    enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        learningPathId: roadmap.id,
        isDeleted: false,
      },
    });

    nodeProgresses = await prisma.nodeProgress.findMany({
      where: {
        userId,
        node: {
          learningPathId: roadmap.id,
        },
        isDeleted: false,
      },
      select: {
        nodeId: true,
        completed: true,
        completedAt: true,
      },
    });
  }

  const isOwner = roadmap.mentorId === userId;
  const isAdmin = roles.includes('ADMIN');
  const isEnrolled = Boolean(enrollment && enrollment.status !== 'DROPPED');
  const isPublic =
    roadmap.isPublic ||
    roadmap.status === 'APPROVED' ||
    roadmap.status === 'PUBLISHED';

  if (!isOwner && !isAdmin && !isEnrolled && !isPublic) {
    throw new ApiError(403, MSG.forbidden);
  }

  const nodeProgressMap = new Map(
    nodeProgresses.map((item) => [item.nodeId, item])
  );

  return {
    ...roadmap,
    slug: toRoadmapSlug(roadmap.title),
    enrollment,
    nodes: roadmap.nodes.map((node) => ({
      ...node,
      completed: Boolean(nodeProgressMap.get(node.id)?.completed),
      completedAt: nodeProgressMap.get(node.id)?.completedAt || null,
    })),
  };
};

/**
 * Get paginated list of roadmaps belonging to the logged-in mentor.
 */
exports.getMentorRoadmaps = async (mentorId, { skip = 0, take = 20 } = {}) => {
  const [roadmaps, total] = await Promise.all([
    roadmapRepository.findByMentorId(mentorId, { skip, take }),
    roadmapRepository.countByMentorId(mentorId),
  ]);
  return { roadmaps, total };
};

/**
 * Update a roadmap's metadata and intelligently sync its node list.
 */
exports.updateRoadmap = async (roadmapId, data, mentorId) => {
  const existing = await assertOwnership(roadmapId, mentorId);

  const resolvedTitle = data.title || data.name || existing.title;
  const resolvedSubjectId = data.subjectId
    ? await resolveSubjectId(data.subjectId)
    : existing.subjectId;

  const updatePayload = {
    title: resolvedTitle,
    description:
      data.description !== undefined ? data.description : existing.description,
    studyTips:
      data.studyTips !== undefined ? data.studyTips : existing.studyTips,
    thumbnail:
      data.thumbnail !== undefined ? data.thumbnail : existing.thumbnail,
    xpReward: data.xpReward !== undefined ? data.xpReward : existing.xpReward,
    subject: { connect: { id: resolvedSubjectId } },
    updatedAt: new Date(),
  };

  if (data.status) {
    updatePayload.status = data.status;
  }

  await prisma.$transaction(async (tx) => {
    await roadmapRepository.update(roadmapId, updatePayload, tx);

    // Sync nodes if provided
    if (Array.isArray(data.nodes)) {
      const normalizedNodesForUpdate = data.nodes.map((node, idx) => {
        const durationParts = normalizeDurationParts(
          node.durationParts || node.duration
        );
        return {
          ...node,
          orderIndex: node.orderIndex !== undefined ? node.orderIndex : idx,
          duration: serializeDuration(durationParts),
          durationParts,
        };
      });
      await roadmapRepository.syncNodes(
        roadmapId,
        normalizedNodesForUpdate,
        tx
      );
    }

    return null;
  });

  // Re-fetch to include updated nodes in response
  return roadmapRepository.findById(roadmapId);
};

/**
 * Soft-delete a roadmap (must belong to the mentor; cannot delete PUBLISHED).
 */
exports.deleteRoadmap = async (roadmapId, mentorId) => {
  const existing = await assertOwnership(roadmapId, mentorId);

  if (existing.status === 'PUBLISHED') {
    throw new ApiError(400, MSG.cannotDelete);
  }

  await roadmapRepository.softDelete(roadmapId);
};

/**
 * Submit a DRAFT roadmap for admin review (sets status to PENDING).
 */
exports.submitRoadmap = async (roadmapId, mentorId) => {
  const existing = await assertOwnership(roadmapId, mentorId);

  if (
    existing.status !== 'DRAFT' &&
    existing.status !== 'REJECTED' &&
    existing.status !== 'PUBLISHED'
  ) {
    throw new ApiError(400, MSG.cannotSubmit);
  }

  const submittedRoadmap = await prisma.$transaction(async (tx) => {
    const updated = await roadmapRepository.update(
      roadmapId,
      {
        status: 'PENDING',
        updatedAt: new Date(),
      },
      tx
    );

    await notifyAdminsAboutPendingRoadmap(tx, updated);

    return updated;
  });

  return roadmapRepository.findById(submittedRoadmap.id);
};

/**
 * Get roadmaps pending review (ADMIN only).
 */
exports.getPendingRoadmaps = async ({ skip = 0, take = 20 } = {}) => {
  const [roadmaps, total] = await Promise.all([
    roadmapRepository.findByStatus('PENDING', { skip, take }),
    roadmapRepository.countByStatus('PENDING'),
  ]);
  return { roadmaps, total };
};

/**
 * Review a roadmap (ADMIN only).
 */
exports.reviewRoadmap = async (roadmapId, { status, feedback }) => {
  const roadmap = await roadmapRepository.findById(roadmapId);
  if (!roadmap) throw new ApiError(404, MSG.notFound);

  if (roadmap.status !== 'PENDING') {
    throw new ApiError(400, 'Only PENDING roadmaps can be reviewed');
  }

  const updated = await prisma.$transaction(async (tx) => {
    const reviewed = await roadmapRepository.update(
      roadmapId,
      {
        status,
        updatedAt: new Date(),
      },
      tx
    );

    if (status === 'APPROVED') {
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_learningPathId: {
            userId: reviewed.mentorId,
            learningPathId: reviewed.id,
          },
        },
      });

      if (!existingEnrollment) {
        await tx.enrollment.create({
          data: {
            userId: reviewed.mentorId,
            learningPathId: reviewed.id,
            status: 'ACTIVE',
            progressPercent: 0,
          },
        });
      }
    }

    await notifyMentorAboutRoadmapReview(tx, reviewed, status, feedback);

    return reviewed;
  });

  return updated;
};

/**
 * Get roadmap statistics for dashboard (ADMIN only).
 */
exports.getRoadmapStats = async () => {
  return roadmapRepository.getStatusStats();
};

/**
 * Get mentor dashboard statistics
 */
exports.getMentorDashboardStats = async (mentorId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // 1. Total Roadmaps
  const totalRoadmaps = await prisma.learningPath.count({
    where: { mentorId, isDeleted: false },
  });

  // 2. Approved Contributions & Trend
  const approvedContributions = await prisma.tip.count({
    where: {
      node: { learningPath: { mentorId, isDeleted: false } },
      status: 'APPROVED',
      isDeleted: false,
    },
  });

  const currentMonthContributions = await prisma.tip.count({
    where: {
      node: { learningPath: { mentorId, isDeleted: false } },
      status: 'APPROVED',
      isDeleted: false,
      reviewedAt: { gte: startOfMonth },
    },
  });

  const lastMonthContributions = await prisma.tip.count({
    where: {
      node: { learningPath: { mentorId, isDeleted: false } },
      status: 'APPROVED',
      isDeleted: false,
      reviewedAt: { gte: startOfLastMonth, lt: startOfMonth },
    },
  });

  let contributionsTrend = '+0%';
  if (lastMonthContributions === 0) {
    contributionsTrend =
      currentMonthContributions > 0
        ? `+${currentMonthContributions * 100}%`
        : '0%';
  } else {
    const diff = currentMonthContributions - lastMonthContributions;
    const percent = Math.round((diff / lastMonthContributions) * 100);
    contributionsTrend = percent >= 0 ? `+${percent}%` : `${percent}%`;
  }

  // 3. Total Students & Trend
  const totalStudentsAggr = await prisma.enrollment.groupBy({
    by: ['userId'],
    where: {
      learningPath: { mentorId, isDeleted: false },
      isDeleted: false,
    },
  });
  const totalStudents = totalStudentsAggr.length;

  const currentMonthStudentsAggr = await prisma.enrollment.groupBy({
    by: ['userId'],
    where: {
      learningPath: { mentorId, isDeleted: false },
      isDeleted: false,
      enrolledAt: { gte: startOfMonth },
    },
  });
  const currentMonthStudents = currentMonthStudentsAggr.length;

  const lastMonthStudentsAggr = await prisma.enrollment.groupBy({
    by: ['userId'],
    where: {
      learningPath: { mentorId, isDeleted: false },
      isDeleted: false,
      enrolledAt: { gte: startOfLastMonth, lt: startOfMonth },
    },
  });
  const lastMonthStudents = lastMonthStudentsAggr.length;

  let studentsTrend = '+0%';
  if (lastMonthStudents === 0) {
    studentsTrend =
      currentMonthStudents > 0 ? `+${currentMonthStudents * 100}%` : '0%';
  } else {
    const diff = currentMonthStudents - lastMonthStudents;
    const percent = Math.round((diff / lastMonthStudents) * 100);
    studentsTrend = percent >= 0 ? `+${percent}%` : `${percent}%`;
  }

  // 4. Average Rating & Trend
  const reviewAggr = await prisma.review.aggregate({
    _avg: { rating: true },
    where: {
      learningPath: { mentorId, isDeleted: false },
      isDeleted: false,
    },
  });
  const averageRating = reviewAggr._avg.rating
    ? Number(reviewAggr._avg.rating.toFixed(1))
    : 0;

  const reviewAggrBeforeThisMonth = await prisma.review.aggregate({
    _avg: { rating: true },
    where: {
      learningPath: { mentorId, isDeleted: false },
      isDeleted: false,
      createdAt: { lt: startOfMonth },
    },
  });
  const prevAverageRating = reviewAggrBeforeThisMonth._avg.rating
    ? Number(reviewAggrBeforeThisMonth._avg.rating.toFixed(1))
    : averageRating;

  const ratingDiff = (averageRating - prevAverageRating).toFixed(1);
  const ratingTrend = ratingDiff >= 0 ? `+${ratingDiff}` : `${ratingDiff}`;

  return {
    totalRoadmaps,
    approvedContributions,
    contributionsTrend,
    totalStudents,
    studentsTrend,
    averageRating,
    ratingTrend,
  };
};
