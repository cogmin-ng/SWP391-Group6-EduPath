const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');
const roadmapRepository = require('../repositories/roadmapRepository');
const {
  findLearningPathIdBySlug,
  toRoadmapSlug,
} = require('../utils/roadmapSlug');
const nodeRepository = require('../repositories/nodeRepository');

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

  const roadmapId = await prisma.$transaction(async (tx) => {
    const created = await roadmapRepository.create(
      {
        title: resolvedTitle,
        description: data.description || null,
        // studyTips: data.studyTips || null,
        thumbnail: data.thumbnail || null,
        status: 'DRAFT',
        xpReward: data.xpReward ?? 0,
        mentor: { connect: { id: mentorId } },
        subject: { connect: { id: resolvedSubjectId } },
        nodes: {
          create: nodes.map((node, idx) => ({
            title: node.title,
            description: node.description || null,
            orderIndex: node.orderIndex !== undefined ? node.orderIndex : idx,
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
    for (let i = 0; i < nodes.length; i++) {
      const input = nodes[i];
      const target = createdNodes[i];
      if (!target) continue;
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

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      learningPathId: roadmap.id,
      isDeleted: false,
    },
  });

  const nodeProgresses = await prisma.nodeProgress.findMany({
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
    // studyTips:
    //   data.studyTips !== undefined ? data.studyTips : existing.studyTips,
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
      await roadmapRepository.syncNodes(roadmapId, data.nodes, tx);
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

  await roadmapRepository.update(roadmapId, {
    status: 'PENDING',
    updatedAt: new Date(),
  });

  return roadmapRepository.findById(roadmapId);
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
exports.reviewRoadmap = async (roadmapId, { status }) => {
  const roadmap = await roadmapRepository.findById(roadmapId);
  if (!roadmap) throw new ApiError(404, MSG.notFound);

  if (roadmap.status !== 'PENDING') {
    throw new ApiError(400, 'Only PENDING roadmaps can be reviewed');
  }

  const updated = await roadmapRepository.update(roadmapId, {
    status,
    updatedAt: new Date(),
  });

  // Auto-enroll mentor if approved
  if (status === 'APPROVED') {
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_learningPathId: {
          userId: updated.mentorId,
          learningPathId: updated.id,
        },
      },
    });

    if (!existingEnrollment) {
      await prisma.enrollment.create({
        data: {
          userId: updated.mentorId,
          learningPathId: updated.id,
          status: 'ACTIVE',
          progressPercent: 0,
        },
      });
    }
  }

  return updated;
};

/**
 * Get roadmap statistics for dashboard (ADMIN only).
 */
exports.getRoadmapStats = async () => {
  return roadmapRepository.getStatusStats();
};
