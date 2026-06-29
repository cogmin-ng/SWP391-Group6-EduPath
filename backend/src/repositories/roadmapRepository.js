const prisma = require('../lib/prisma');
const nodeRepository = require('./nodeRepository');

const ACTIVE_FILTER = { isDeleted: false };

const ROADMAP_INCLUDE = {
  subject: {
    select: { id: true, name: true, description: true },
  },
  mentor: {
    select: { id: true, name: true, email: true, avatar: true },
  },
  nodes: {
    where: ACTIVE_FILTER,
    orderBy: { orderIndex: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      orderIndex: true,
      createdAt: true,
      updatedAt: true,
      checklists: {
        where: ACTIVE_FILTER,
        orderBy: { orderIndex: 'asc' },
      },
      materials: {
        where: ACTIVE_FILTER,
        orderBy: { createdAt: 'asc' },
      },
      quizzes: {
        where: ACTIVE_FILTER,
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          title: true,
          passingScore: true,
          xpReward: true,
          questions: {
            where: ACTIVE_FILTER,
            include: {
              options: {
                where: ACTIVE_FILTER,
              },
            },
          },
        },
      },
      tips: {
        where: {
          isDeleted: false,
          contributorId: null,
        },
        select: {
          id: true,
          content: true,
        },
      },
    },
  },
};

const mapRoadmapNodeTips = (roadmap) => {
  if (!roadmap) return null;
  if (Array.isArray(roadmap)) {
    return roadmap.map(mapRoadmapNodeTips);
  }
  if (Array.isArray(roadmap.nodes)) {
    roadmap.nodes = roadmap.nodes.map(node => ({
      ...node,
      studyTips: node.tips?.[0]?.content || '',
    }));
  }
  return roadmap;
};

/**
 * Create a new learning path (roadmap) with optional nested nodes.
 */
exports.create = async (data, tx = prisma) => {
  const result = await tx.learningPath.create({
    data,
    include: ROADMAP_INCLUDE,
  });
  return mapRoadmapNodeTips(result);
};

/**
 * Find a roadmap by its ID (including nodes, subject, mentor).
 */
exports.findById = async (id) => {
  const result = await prisma.learningPath.findFirst({
    where: { id, ...ACTIVE_FILTER },
    include: ROADMAP_INCLUDE,
  });
  return mapRoadmapNodeTips(result);
};

/**
 * Find all roadmaps owned by a specific mentor.
 */
exports.findByMentorId = async (mentorId, { skip = 0, take = 20 } = {}) => {
  return prisma.learningPath.findMany({
    where: { mentorId, ...ACTIVE_FILTER },
    include: {
      subject: {
        select: { id: true, name: true },
      },
      nodes: {
        where: ACTIVE_FILTER,
        select: { id: true, title: true, orderIndex: true },
        orderBy: { orderIndex: 'asc' },
      },
      _count: {
        select: { enrollments: true, reviews: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
    skip,
    take,
  });
};

/**
 * Find roadmaps by status (e.g., PENDING) with pagination.
 */
exports.findByStatus = async (status, { skip = 0, take = 20 } = {}) => {
  const result = await prisma.learningPath.findMany({
    where: { status, ...ACTIVE_FILTER },
    include: ROADMAP_INCLUDE,
    orderBy: { updatedAt: 'desc' },
    skip,
    take,
  });
  return mapRoadmapNodeTips(result);
};

/**
 * Count roadmaps by status.
 */
exports.countByStatus = async (status) => {
  return prisma.learningPath.count({
    where: { status, ...ACTIVE_FILTER },
  });
};

/**
 * Get distribution of roadmap statuses for stats.
 */
exports.getStatusStats = async () => {
  const counts = await prisma.learningPath.groupBy({
    by: ['status'],
    where: ACTIVE_FILTER,
    _count: {
      status: true,
    },
  });

  return counts.reduce((acc, curr) => {
    acc[curr.status] = curr._count.status;
    return acc;
  }, {});
};

/**
 * Count total roadmaps for a mentor.
 */
exports.countByMentorId = async (mentorId) => {
  return prisma.learningPath.count({
    where: { mentorId, ...ACTIVE_FILTER },
  });
};

/**
 * Update basic roadmap info (title, description, thumbnail, status, xpReward, subjectId).
 */
exports.update = async (id, data, tx = prisma) => {
  const result = await tx.learningPath.update({
    where: { id },
    data,
    include: ROADMAP_INCLUDE,
  });
  return mapRoadmapNodeTips(result);
};

/**
 * Soft-delete a roadmap.
 */
exports.softDelete = async (id, tx = prisma) => {
  return tx.learningPath.update({
    where: { id },
    data: { isDeleted: true, updatedAt: new Date() },
  });
};

/**
 * Fetch all active node IDs for a given roadmap.
 */
exports.findActiveNodeIds = async (learningPathId) => {
  const nodes = await prisma.node.findMany({
    where: { learningPathId, isDeleted: false },
    select: { id: true },
  });
  return nodes.map((n) => n.id);
};

/**
 * Sync nodes for a roadmap in a transaction:
 * - Soft-delete removed nodes
 * - Update existing nodes
 * - Create new nodes
 */
exports.syncNodes = async (learningPathId, nodes, tx = prisma) => {
  const lp = await tx.learningPath.findUnique({
    where: { id: learningPathId },
    select: { mentorId: true }
  });
  const mentorId = lp ? lp.mentorId : null;

  const existingIds = await tx.node
    .findMany({
      where: { learningPathId, isDeleted: false },
      select: { id: true },
    })
    .then((rows) => rows.map((r) => r.id));

  const incomingIds = nodes
    .filter((n) => n.id && typeof n.id === 'string' && n.id.length > 0)
    .map((n) => n.id);

  // Soft-delete nodes that are no longer in the list
  const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
  if (toDelete.length > 0) {
    await tx.node.updateMany({
      where: { id: { in: toDelete } },
      data: { isDeleted: true, updatedAt: new Date() },
    });
  }

  // Upsert each incoming node
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const orderIndex = node.orderIndex !== undefined ? node.orderIndex : i;

    // Check if this is a valid existing node ID
    const isExisting =
      node.id && typeof node.id === 'string' && existingIds.includes(node.id);

    let nodeId;
    if (isExisting) {
      await tx.node.update({
        where: { id: node.id },
        data: {
          title: node.title,
          description: node.description || null,
          orderIndex,
          updatedAt: new Date(),
        },
      });
      nodeId = node.id;
    } else {
      const created = await tx.node.create({
        data: {
          learningPathId,
          title: node.title,
          description: node.description || null,
          orderIndex,
        },
      });
      nodeId = created.id;
    }

    // Sync study tips for Node
    if (node.studyTips !== undefined && mentorId) {
      const existingTip = await tx.tip.findFirst({
        where: {
          nodeId,
          createdById: mentorId,
          contributorId: null,
          isDeleted: false,
        },
      });

      const trimmedTip = node.studyTips ? node.studyTips.trim() : '';

      if (existingTip) {
        if (!trimmedTip) {
          // Soft delete tip if empty
          await tx.tip.update({
            where: { id: existingTip.id },
            data: { isDeleted: true, updatedAt: new Date() },
          });
        } else if (existingTip.content !== trimmedTip) {
          // Update tip if content changed
          await tx.tip.update({
            where: { id: existingTip.id },
            data: { content: trimmedTip, updatedAt: new Date() },
          });
        }
      } else if (trimmedTip) {
        // Create new tip
        await tx.tip.create({
          data: {
            nodeId,
            content: trimmedTip,
            createdById: mentorId,
            status: 'APPROVED',
            isPublished: true,
            publishedAt: new Date(),
          },
        });
      }
    }

    // Sync node details (checklists & materials) when provided by the client
    if (Array.isArray(node.checklists)) {
      await nodeRepository.syncChecklists(nodeId, node.checklists, tx);
    }
    if (Array.isArray(node.materials)) {
      await nodeRepository.syncMaterials(nodeId, node.materials, tx);
    }
    if (Array.isArray(node.quizzes)) {
      await exports.syncQuizzes(nodeId, node.quizzes, tx);
    }
  }
};

/**
 * Sync Quizzes for a Node
 * Handles creation, update (cascade to questions/options), and deletion
 */
exports.syncQuizzes = async (nodeId, quizzes, tx = prisma) => {
  const existingIds = await tx.quiz
    .findMany({
      where: { nodeId, isDeleted: false },
      select: { id: true },
    })
    .then((rows) => rows.map((r) => r.id));

  const incomingIds = quizzes
    .filter((q) => q.id && typeof q.id === 'string' && q.id.length > 0)
    .map((q) => q.id);

  // Soft delete missing quizzes
  const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
  if (toDelete.length > 0) {
    await tx.quiz.updateMany({
      where: { id: { in: toDelete } },
      data: { isDeleted: true },
    });
  }

  // Upsert each quiz
  for (const quizData of quizzes) {
    const isExisting =
      quizData.id &&
      typeof quizData.id === 'string' &&
      existingIds.includes(quizData.id);

    if (isExisting) {
      // Update existing quiz (cascade sync questions)
      // For simplicity in sync, we'll delete old questions/options and recreate
      // (Similar strategy to quizService.updateQuiz)
      await tx.quizOption.deleteMany({
        where: { question: { quizId: quizData.id } },
      });
      await tx.quizQuestion.deleteMany({
        where: { quizId: quizData.id },
      });

      await tx.quiz.update({
        where: { id: quizData.id },
        data: {
          title: quizData.title,
          description: quizData.description || null,
          passingScore: quizData.passingScore,
          xpReward: quizData.xpReward ?? 50,
          questions: {
            create: quizData.questions.map((q) => ({
              question: q.question,
              explanation: q.explanation || null,
              options: {
                create: q.options.map((opt) => ({
                  content: opt.content,
                  isCorrect: opt.isCorrect,
                })),
              },
            })),
          },
        },
      });
    } else {
      // Create new quiz
      await tx.quiz.create({
        data: {
          nodeId,
          title: quizData.title,
          description: quizData.description || null,
          passingScore: quizData.passingScore,
          xpReward: quizData.xpReward ?? 50,
          questions: {
            create: quizData.questions.map((q) => ({
              question: q.question,
              explanation: q.explanation || null,
              options: {
                create: q.options.map((opt) => ({
                  content: opt.content,
                  isCorrect: opt.isCorrect,
                })),
              },
            })),
          },
        },
      });
    }
  }
};
