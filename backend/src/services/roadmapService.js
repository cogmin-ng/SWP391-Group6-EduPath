const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');
const roadmapRepository = require('../repositories/roadmapRepository');

const MSG = {
  notFound: 'Roadmap not found',
  forbidden: 'You do not have permission to perform this action',
  subjectNotFound: 'Subject not found',
  cannotSubmit: 'Only DRAFT roadmaps can be submitted for review',
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

  const roadmap = await prisma.$transaction(async (tx) => {
    const created = await roadmapRepository.create(
      {
        title: resolvedTitle,
        description: data.description || null,
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
    return created;
  });

  return roadmap;
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

  // If roadmap has already been published, prevent editing
  if (existing.status === 'PUBLISHED') {
    throw new ApiError(
      400,
      'Cannot edit a PUBLISHED roadmap. Create a new version instead.'
    );
  }

  const resolvedTitle = data.title || data.name || existing.title;
  const resolvedSubjectId = data.subjectId
    ? await resolveSubjectId(data.subjectId)
    : existing.subjectId;

  const updatePayload = {
    title: resolvedTitle,
    description:
      data.description !== undefined ? data.description : existing.description,
    thumbnail:
      data.thumbnail !== undefined ? data.thumbnail : existing.thumbnail,
    xpReward: data.xpReward !== undefined ? data.xpReward : existing.xpReward,
    subject: { connect: { id: resolvedSubjectId } },
    updatedAt: new Date(),
  };

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

  if (existing.status !== 'DRAFT') {
    throw new ApiError(400, MSG.cannotSubmit);
  }

  await roadmapRepository.update(roadmapId, {
    status: 'PENDING',
    updatedAt: new Date(),
  });

  return roadmapRepository.findById(roadmapId);
};
