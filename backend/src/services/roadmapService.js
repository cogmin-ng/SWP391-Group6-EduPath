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
  cannotSubmit:
    'Only DRAFT, REJECTED, APPROVED or PUBLISHED roadmaps can be submitted for review',
  cannotDelete:
    'Cannot delete a PUBLISHED roadmap. Archive it first or contact admin.',
};

const ACTIVE = { isDeleted: false };

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function hasMajorChanges(existing, incoming) {
  if (!incoming.nodes) return false;

  const existingNodes = existing.nodes || [];
  const incomingNodes = incoming.nodes;
  if (existingNodes.length !== incomingNodes.length) return true;

  for (let i = 0; i < incomingNodes.length; i++) {
    const incNode = incomingNodes[i];
    const extNode = existingNodes[i];
    if (!extNode) return true;

    if (!incNode.id || incNode.id !== extNode.id) return true;
    if (incNode.title !== extNode.title) return true;
    if ((incNode.description || '') !== (extNode.description || '')) return true;

    const durationParts = normalizeDurationParts(incNode.durationParts || incNode.duration);
    const incDuration = serializeDuration(durationParts);
    if ((incDuration || '') !== (extNode.duration || '')) return true;

    const incChecklists = incNode.checklists || [];
    const extChecklists = extNode.checklists || [];
    if (incChecklists.length !== extChecklists.length) return true;
    for (let j = 0; j < incChecklists.length; j++) {
      if (incChecklists[j].title !== extChecklists[j].title) return true;
      if ((incChecklists[j].description || '') !== (extChecklists[j].description || '')) return true;
      if ((incChecklists[j].xpReward ?? 10) !== extChecklists[j].xpReward) return true;
    }

    const incMaterials = incNode.materials || [];
    const extMaterials = extNode.materials || [];
    if (incMaterials.length !== extMaterials.length) return true;
    for (let j = 0; j < incMaterials.length; j++) {
      if (incMaterials[j].title !== extMaterials[j].title) return true;
      if ((incMaterials[j].description || '') !== (extMaterials[j].description || '')) return true;
      if (incMaterials[j].url !== extMaterials[j].url) return true;
      if ((incMaterials[j].type || 'LINK') !== extMaterials[j].type) return true;
    }

    const incQuizzes = incNode.quizzes || [];
    const extQuizzes = extNode.quizzes || [];
    if (incQuizzes.length !== extQuizzes.length) return true;
    for (let j = 0; j < incQuizzes.length; j++) {
      if (incQuizzes[j].title !== extQuizzes[j].title) return true;
      if ((incQuizzes[j].description || '') !== (extQuizzes[j].description || '')) return true;
      if ((incQuizzes[j].passingScore ?? 70) !== extQuizzes[j].passingScore) return true;

      const incQuestions = incQuizzes[j].questions || [];
      const extQuestions = extQuizzes[j].questions || [];
      if (incQuestions.length !== extQuestions.length) return true;
      for (let k = 0; k < incQuestions.length; k++) {
        if (incQuestions[k].question !== extQuestions[k].question) return true;
        if ((incQuestions[k].explanation || '') !== (extQuestions[k].explanation || '')) return true;

        const incOptions = incQuestions[k].options || [];
        const extOptions = extQuestions[k].options || [];
        if (incOptions.length !== extOptions.length) return true;
        for (let l = 0; l < incOptions.length; l++) {
          if (incOptions[l].content !== extOptions[l].content) return true;
          if (incOptions[l].isCorrect !== extOptions[l].isCorrect) return true;
        }
      }
    }
  }

  return false;
}

async function cloneRoadmap(originalRoadmapId, mentorId, tx = prisma) {
  const original = await tx.learningPath.findUnique({
    where: { id: originalRoadmapId },
    include: {
      nodes: {
        where: { isDeleted: false },
        include: {
          checklists: { where: { isDeleted: false } },
          materials: { where: { isDeleted: false } },
          quizzes: {
            where: { isDeleted: false },
            include: {
              questions: {
                where: { isDeleted: false },
                include: {
                  options: { where: { isDeleted: false } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!original) throw new ApiError(404, 'Original roadmap not found');

  const clone = await tx.learningPath.create({
    data: {
      title: original.title,
      description: original.description,
      thumbnail: original.thumbnail,
      studyTips: original.studyTips,
      status: 'DRAFT',
      xpReward: original.xpReward,
      isPublic: false,
      mentorId: original.mentorId,
      subjectId: original.subjectId,
      parentLearningPathId: original.id,
      nodes: {
        create: original.nodes.map((node) => ({
          title: node.title,
          description: node.description,
          duration: node.duration,
          orderIndex: node.orderIndex,
          checklists: {
            create: node.checklists.map((c) => ({
              title: c.title,
              description: c.description,
              orderIndex: c.orderIndex,
              xpReward: c.xpReward,
            })),
          },
          materials: {
            create: node.materials.map((m) => ({
              title: m.title,
              description: m.description,
              url: m.url,
              type: m.type,
            })),
          },
          quizzes: {
            create: node.quizzes.map((q) => ({
              title: q.title,
              description: q.description,
              passingScore: q.passingScore,
              xpReward: q.xpReward,
              questions: {
                create: q.questions.map((question) => ({
                  question: question.question,
                  explanation: question.explanation,
                  options: {
                    create: question.options.map((opt) => ({
                      content: opt.content,
                      isCorrect: opt.isCorrect,
                    })),
                  },
                })),
              },
            })),
          },
        })),
      },
    },
  });

  return clone.id;
}

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
      : `Lộ trình "${roadmap.title}" của bạn đã bị từ chối.${feedback ? ` Lý do: ${feedback}` : ''
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
  }, {
    maxWait: 15000,
    timeout: 30000,
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

  const isLive = existing.status === 'APPROVED' || existing.status === 'PUBLISHED';
  const majorChanges = hasMajorChanges(existing, data);

  let targetRoadmapId = roadmapId;

  if (isLive && majorChanges) {
    // Check if a DRAFT child version already exists for this parent
    const existingDraft = await prisma.learningPath.findFirst({
      where: {
        parentLearningPathId: roadmapId,
        status: 'DRAFT',
        isDeleted: false,
      },
      select: { id: true },
    });

    if (existingDraft) {
      targetRoadmapId = existingDraft.id;
    } else {
      // Clone it to create a new DRAFT version
      targetRoadmapId = await prisma.$transaction(async (tx) => {
        return cloneRoadmap(roadmapId, mentorId, tx);
      });
    }
  }

  const resolvedTitle = data.title || data.name || (targetRoadmapId === roadmapId ? existing.title : data.title);
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

  if (data.status && targetRoadmapId === roadmapId) {
    updatePayload.status = data.status;
  }

  await prisma.$transaction(async (tx) => {
    await roadmapRepository.update(targetRoadmapId, updatePayload, tx);

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
        targetRoadmapId,
        normalizedNodesForUpdate,
        tx
      );
    }

    return null;
  }, {
    maxWait: 15000,
    timeout: 30000,
  });

  // Re-fetch to include updated nodes in response
  return roadmapRepository.findById(targetRoadmapId);
};

exports.deleteRoadmap = async (roadmapId, mentorId) => {
  const existing = await assertOwnership(roadmapId, mentorId);

  if (existing.status === 'PENDING_DELETE') {
    throw new ApiError(400, 'Yêu cầu xóa lộ trình này đang chờ duyệt.');
  }

  // Count active student enrollments
  const studentCount = await prisma.enrollment.count({
    where: {
      learningPathId: roadmapId,
      status: 'ACTIVE',
      isDeleted: false,
    },
  });

  if (studentCount > 0) {
    // If students are enrolled, transition to PENDING_DELETE status for admin approval
    await prisma.$transaction(async (tx) => {
      await tx.learningPath.update({
        where: { id: roadmapId },
        data: {
          status: 'PENDING_DELETE',
          updatedAt: new Date(),
        },
      });

      // Notify admins about the deletion request
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
            title: 'Yêu cầu xóa lộ trình',
            content: `Mentor vừa gửi yêu cầu xóa lộ trình "${existing.title}" đã có học viên tham gia.`,
          },
          tx
        );
      }
    });

    return { action: 'ARCHIVED', status: 'PENDING_DELETE', studentCount };
  } else {
    // No students enrolled -> directly soft delete
    await roadmapRepository.softDelete(roadmapId);
    return { action: 'DELETED', status: 'DELETED', studentCount };
  }
};

/**
 * Submit a DRAFT roadmap for admin review (sets status to PENDING).
 */
exports.submitRoadmap = async (roadmapId, mentorId) => {
  const existing = await assertOwnership(roadmapId, mentorId);

  if (
    existing.status !== 'DRAFT' &&
    existing.status !== 'REJECTED' &&
    existing.status !== 'PUBLISHED' &&
    existing.status !== 'APPROVED'
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
 * Get roadmaps by status for admin (ADMIN only).
 */
exports.getPendingRoadmaps = async ({ status = 'PENDING', skip = 0, take = 20 } = {}) => {
  const [roadmaps, total] = await Promise.all([
    roadmapRepository.findByStatus(status, { skip, take }),
    roadmapRepository.countByStatus(status),
  ]);

  // Map the roadmap node tips manually to be consistent with ROADMAP_INCLUDE mapping logic
  const mappedRoadmaps = roadmaps.map((roadmap) => {
    if (Array.isArray(roadmap.nodes)) {
      roadmap.nodes = roadmap.nodes.map((node) => ({
        ...node,
        studyTips: '',
      }));
    }
    return roadmap;
  });

  return { roadmaps: mappedRoadmaps, total };
};

/**
 * Review a roadmap (ADMIN only).
 */
exports.reviewRoadmap = async (roadmapId, { status, feedback }) => {
  const roadmap = await roadmapRepository.findById(roadmapId);
  if (!roadmap) throw new ApiError(404, MSG.notFound);

  if (roadmap.status !== 'PENDING' && roadmap.status !== 'PENDING_DELETE') {
    throw new ApiError(400, 'Only PENDING or PENDING_DELETE roadmaps can be reviewed');
  }

  // Handle deletion request review
  if (roadmap.status === 'PENDING_DELETE') {
    const updatedStatus =
      status === 'APPROVED' || status === 'PUBLISHED' ? 'ARCHIVED' : 'APPROVED';

    const updated = await prisma.$transaction(async (tx) => {
      const reviewed = await roadmapRepository.update(
        roadmapId,
        {
          status: updatedStatus,
          updatedAt: new Date(),
        },
        tx
      );

      // Notify mentor about deletion review outcome
      const message =
        updatedStatus === 'ARCHIVED'
          ? `Yêu cầu xóa lộ trình "${roadmap.title}" đã được phê duyệt. Lộ trình đã chuyển sang trạng thái lưu trữ.`
          : `Yêu cầu xóa lộ trình "${roadmap.title}" của bạn đã bị từ chối.${feedback ? ` Lý do: ${feedback}` : ''
          }`;

      await notificationService.createNotification(
        roadmap.mentorId,
        {
          type: 'ROADMAP',
          title:
            updatedStatus === 'ARCHIVED'
              ? 'Yêu cầu xóa được duyệt'
              : 'Yêu cầu xóa bị từ chối',
          content: message,
        },
        tx
      );

      return reviewed;
    });

    return updated;
  }

  const updated = await prisma.$transaction(async (tx) => {
    // If approving a draft version, merge its changes into the parent roadmap:
    const parentId = roadmap.parentLearningPathId;
    if ((status === 'APPROVED' || status === 'PUBLISHED') && parentId) {
      // 1. Delete all existing nodes of the parent roadmap
      await tx.node.deleteMany({
        where: { learningPathId: parentId },
      });

      // 2. Retrieve all nodes of the draft roadmap
      const draftNodes = await tx.node.findMany({
        where: { learningPathId: roadmap.id, isDeleted: false },
        include: {
          checklists: { where: { isDeleted: false } },
          materials: { where: { isDeleted: false } },
          quizzes: {
            where: { isDeleted: false },
            include: {
              questions: {
                where: { isDeleted: false },
                include: {
                  options: { where: { isDeleted: false } },
                },
              },
            },
          },
        },
      });

      // 3. Create nodes for the parent roadmap
      for (const node of draftNodes) {
        await tx.node.create({
          data: {
            learningPathId: parentId,
            title: node.title,
            description: node.description,
            duration: node.duration,
            orderIndex: node.orderIndex,
            checklists: {
              create: node.checklists.map((c) => ({
                title: c.title,
                description: c.description,
                orderIndex: c.orderIndex,
                xpReward: c.xpReward,
              })),
            },
            materials: {
              create: node.materials.map((m) => ({
                title: m.title,
                description: m.description,
                url: m.url,
                type: m.type,
              })),
            },
            quizzes: {
              create: node.quizzes.map((q) => ({
                title: q.title,
                description: q.description,
                passingScore: q.passingScore,
                xpReward: q.xpReward,
                questions: {
                  create: q.questions.map((question) => ({
                    question: question.question,
                    explanation: question.explanation,
                    options: {
                      create: question.options.map((opt) => ({
                        content: opt.content,
                        isCorrect: opt.isCorrect,
                      })),
                    },
                  })),
                },
              })),
            },
          },
        });
      }

      // 4. Update the parent roadmap's metadata and set status to APPROVED
      const parentReviewed = await roadmapRepository.update(
        parentId,
        {
          title: roadmap.title,
          description: roadmap.description,
          thumbnail: roadmap.thumbnail,
          studyTips: roadmap.studyTips,
          xpReward: roadmap.xpReward,
          subject: { connect: { id: roadmap.subjectId } },
          status: 'APPROVED',
          updatedAt: new Date(),
        },
        tx
      );

      // 5. Hard delete the draft roadmap to clean up
      await tx.learningPath.delete({
        where: { id: roadmap.id },
      });

      await notifyMentorAboutRoadmapReview(tx, parentReviewed, 'APPROVED', feedback);

      return parentReviewed;
    }

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
