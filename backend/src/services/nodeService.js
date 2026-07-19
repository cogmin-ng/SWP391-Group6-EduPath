const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');
const nodeRepository = require('../repositories/nodeRepository');
const certificateService = require('./certificateService');
const {
  awardXp,
  buildEventKey,
  XP_EVENT_TYPES,
  XP_REWARDS,
} = require('./xpService');

const MSG = {
  notFound: 'Node not found',
  forbidden: 'You do not have permission to access or modify this node',
  cannotEditPublished: 'Cannot edit a node inside a PUBLISHED roadmap',
};

/**
 * Assert the node exists and the mentor owns its roadmap.
 * Returns the node with its learningPath relation attached.
 */
async function assertOwnership(nodeId, userId, roles = []) {
  const node = await nodeRepository.findByIdWithDetails(nodeId);
  if (!node) throw new ApiError(404, MSG.notFound);

  const isOwner = node.learningPath?.mentorId === userId;
  const isAdmin = roles.includes('ADMIN');

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, MSG.forbidden);
  }

  return node;
}

async function assertReadAccess(nodeId, userId, roles = []) {
  const node = await nodeRepository.findByIdWithDetails(nodeId);
  if (!node) throw new ApiError(404, MSG.notFound);

  const isOwner = node.learningPath?.mentorId === userId;
  const isAdmin = roles.includes('ADMIN');

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      learningPathId: node.learningPath?.id,
      isDeleted: false,
      status: { not: 'DROPPED' },
    },
  });

  if (!isOwner && !isAdmin && !enrollment) {
    throw new ApiError(403, MSG.forbidden);
  }

  return { node, enrollment, isOwner, isAdmin };
}

async function assertEnrollment(nodeId, userId) {
  const node = await prisma.node.findFirst({
    where: { id: nodeId, isDeleted: false },
    select: {
      id: true,
      learningPathId: true,
    },
  });

  if (!node) throw new ApiError(404, MSG.notFound);

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      learningPathId: node.learningPathId,
      isDeleted: false,
      status: { not: 'DROPPED' },
    },
  });

  if (!enrollment) {
    throw new ApiError(403, 'You are not enrolled in this roadmap');
  }

  return { node, enrollment };
}

async function recalculateEnrollmentProgress(
  learningPathId,
  userId,
  tx = prisma
) {
  const [totalNodes, completedNodes] = await Promise.all([
    tx.node.count({
      where: { learningPathId, isDeleted: false },
    }),
    tx.nodeProgress.count({
      where: {
        userId,
        completed: true,
        isDeleted: false,
        node: {
          learningPathId,
          isDeleted: false,
        },
      },
    }),
  ]);

  const progressPercent =
    totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;

  const enrollment = await tx.enrollment.updateMany({
    where: {
      userId,
      learningPathId,
      isDeleted: false,
    },
    data: {
      progressPercent,
      status: progressPercent >= 100 ? 'COMPLETED' : 'ACTIVE',
    },
  });

  return { progressPercent, updatedCount: enrollment.count };
}

/**
 * Get node details including checklists, materials, quizzes, tips.
 * Accessible by Mentor owner or Admin.
 */
exports.getNodeDetails = async (nodeId, userId, roles = []) => {
  const { node, isOwner, isAdmin } = await assertReadAccess(
    nodeId,
    userId,
    roles
  );

  const [checklistProgresses, quizAttempts] = await Promise.all([
    prisma.checklistProgress.findMany({
      where: {
        userId,
        isDeleted: false,
        checklist: {
          nodeId,
          isDeleted: false,
        },
      },
      select: {
        checklistId: true,
        completed: true,
        completedAt: true,
      },
    }),
    prisma.quizAttempt.findMany({
      where: {
        userId,
        isDeleted: false,
        quiz: {
          nodeId,
          isDeleted: false,
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const checklistProgressMap = new Map(
    checklistProgresses.map((item) => [item.checklistId, item])
  );
  const latestQuizAttemptMap = new Map();
  for (const attempt of quizAttempts) {
    if (!latestQuizAttemptMap.has(attempt.quizId)) {
      latestQuizAttemptMap.set(attempt.quizId, attempt);
    }
  }

  return {
    ...node,
    checklists: node.checklists.map((checklist) => ({
      ...checklist,
      completed: Boolean(checklistProgressMap.get(checklist.id)?.completed),
      completedAt: checklistProgressMap.get(checklist.id)?.completedAt || null,
    })),
    quizzes: node.quizzes.map((quiz) => ({
      ...quiz,
      questionCount: quiz.questions.length,
      latestAttempt: latestQuizAttemptMap.get(quiz.id) || null,
    })),
    tips:
      isOwner || isAdmin
        ? node.tips
        : node.tips.filter((tip) => tip.isPublished),
  };
};

/**
 * Synchronize node checklists and materials.
 * Only Mentor owner can do this.
 */
exports.syncNodeDetails = async (nodeId, data, mentorId, roles = []) => {
  const node = await assertOwnership(nodeId, mentorId, roles);

  // If roadmap is already live (APPROVED or PUBLISHED), prevent direct editing of node details
  if (
    node.learningPath?.status === 'PUBLISHED' ||
    node.learningPath?.status === 'APPROVED'
  ) {
    throw new ApiError(400, MSG.cannotEditPublished);
  }

  await prisma.$transaction(async (tx) => {
    if (Array.isArray(data.checklists)) {
      await nodeRepository.syncChecklists(nodeId, data.checklists, tx);
    }

    if (Array.isArray(data.materials)) {
      await nodeRepository.syncMaterials(nodeId, data.materials, tx);
    }
  });

  // Re-fetch to return the updated structure
  return nodeRepository.findByIdWithDetails(nodeId);
};

exports.toggleChecklistProgress = async (
  nodeId,
  checklistId,
  completed,
  userId,
  roles = []
) => {
  await assertReadAccess(nodeId, userId, roles);
  await assertEnrollment(nodeId, userId);

  const checklist = await prisma.checklist.findFirst({
    where: {
      id: checklistId,
      nodeId,
      isDeleted: false,
    },
  });

  if (!checklist) {
    throw new ApiError(404, 'Checklist item not found');
  }

  await prisma.checklistProgress.upsert({
    where: {
      checklistId_userId: {
        checklistId,
        userId,
      },
    },
    create: {
      checklistId,
      userId,
      completed: Boolean(completed),
      completedAt: completed ? new Date() : null,
    },
    update: {
      completed: Boolean(completed),
      completedAt: completed ? new Date() : null,
      isDeleted: false,
    },
  });

  // Run automatic badge checks
  try {
    const badgeService = require('./badgeService');
    await badgeService.runBadgeChecks(userId);
  } catch (badgeError) {
    console.error('Error running badge checks on checklist toggle:', badgeError);
  }

  return exports.getNodeDetails(nodeId, userId, roles);
};

exports.updateNodeProgress = async (nodeId, completed, userId, roles = []) => {
  await assertReadAccess(nodeId, userId, roles);
  const { node, enrollment: currentEnrollment } = await assertEnrollment(nodeId, userId);

  const existingNodeProgress = await prisma.nodeProgress.findUnique({
    where: {
      userId_nodeId: {
        userId,
        nodeId,
      },
    },
    select: {
      completed: true,
    },
  });

  const wasNodeCompleted = Boolean(existingNodeProgress?.completed);
  const wasRoadmapCompleted =
    currentEnrollment?.status === 'COMPLETED' ||
    Number(currentEnrollment?.progressPercent || 0) >= 100;

  await prisma.$transaction(async (tx) => {
    await tx.nodeProgress.upsert({
      where: {
        userId_nodeId: {
          userId,
          nodeId,
        },
      },
      create: {
        userId,
        nodeId,
        completed: Boolean(completed),
        completedAt: completed ? new Date() : null,
      },
      update: {
        completed: Boolean(completed),
        completedAt: completed ? new Date() : null,
        isDeleted: false,
      },
    });

    await recalculateEnrollmentProgress(node.learningPathId, userId, tx);
  });

  const [nodeProgress, enrollment] = await Promise.all([
    prisma.nodeProgress.findUnique({
      where: {
        userId_nodeId: {
          userId,
          nodeId,
        },
      },
    }),
    prisma.enrollment.findFirst({
      where: {
        userId,
        learningPathId: node.learningPathId,
        isDeleted: false,
      },
    }),
  ]);

  const certificateResult =
    await certificateService.createCertificateIfEligible(
      userId,
      node.learningPathId
    );

  if (completed && !wasNodeCompleted) {
    await awardXp({
      userId,
      type: XP_EVENT_TYPES.NODE_COMPLETED,
      sourceType: 'NODE',
      sourceId: nodeId,
      eventKey: buildEventKey({
        type: XP_EVENT_TYPES.NODE_COMPLETED,
        userId,
        sourceId: nodeId,
      }),
      xpAmount: XP_REWARDS.NODE_COMPLETED,
    });
  }

  const isRoadmapCompleted =
    enrollment?.status === 'COMPLETED' || Number(enrollment?.progressPercent || 0) >= 100;

  if (isRoadmapCompleted && !wasRoadmapCompleted) {
    await awardXp({
      userId,
      type: XP_EVENT_TYPES.ROADMAP_COMPLETED,
      sourceType: 'LEARNING_PATH',
      sourceId: node.learningPathId,
      eventKey: buildEventKey({
        type: XP_EVENT_TYPES.ROADMAP_COMPLETED,
        userId,
        sourceId: node.learningPathId,
      }),
      xpAmount: XP_REWARDS.ROADMAP_COMPLETED,
    });
  }

  // Run automatic badge checks
  try {
    const badgeService = require('./badgeService');
    await badgeService.runBadgeChecks(userId);
  } catch (badgeError) {
    console.error('Error running badge checks on node progress update:', badgeError);
  }

  return {
    nodeProgress,
    enrollment,
    roadmapCompleted: enrollment?.status === 'COMPLETED',
    certificate: certificateResult.certificate,
    certificateIssued: certificateResult.created,
    notification: certificateResult.notification,
  };
};
