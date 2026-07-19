const prisma = require('../lib/prisma');

const ACTIVE_FILTER = { isDeleted: false };

const ACCESSIBLE_NOTE_FILTER = (userId) => ({
  userId,
  ...ACTIVE_FILTER,
  node: {
    ...ACTIVE_FILTER,
    learningPath: {
      ...ACTIVE_FILTER,
      enrollments: {
        some: {
          userId,
          isDeleted: false,
          status: { not: 'DROPPED' },
        },
      },
    },
  },
});

exports.findManyByUser = async (userId, { skip = 0, take = 50 } = {}) => {
  return prisma.personalLearningNote.findMany({
    where: ACCESSIBLE_NOTE_FILTER(userId),
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      node: {
        select: {
          id: true,
          title: true,
          orderIndex: true,
          learningPath: {
            select: { id: true, title: true },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
    skip,
    take,
  });
};

exports.countByUser = async (userId) => {
  return prisma.personalLearningNote.count({
    where: ACCESSIBLE_NOTE_FILTER(userId),
  });
};

exports.findNodeAccess = async (nodeId, userId) => {
  return prisma.node.findFirst({
    where: { id: nodeId, ...ACTIVE_FILTER },
    select: {
      id: true,
      title: true,
      learningPathId: true,
      learningPath: {
        select: {
          enrollments: {
            where: {
              userId,
              isDeleted: false,
              status: { not: 'DROPPED' },
            },
            select: { id: true },
            take: 1,
          },
        },
      },
    },
  });
};

exports.findByNodeAndUser = async (nodeId, userId) => {
  return prisma.personalLearningNote.findFirst({
    where: { nodeId, userId, ...ACTIVE_FILTER },
  });
};

exports.upsert = async ({ nodeId, userId, content }) => {
  return prisma.personalLearningNote.upsert({
    where: { userId_nodeId: { userId, nodeId } },
    create: { nodeId, userId, content },
    update: { content, isDeleted: false },
  });
};

exports.softDelete = async (nodeId, userId) => {
  return prisma.personalLearningNote.updateMany({
    where: { nodeId, userId, ...ACTIVE_FILTER },
    data: { isDeleted: true, updatedAt: new Date() },
  });
};

exports.findRoadmapForExport = async (roadmapId, userId) => {
  return prisma.learningPath.findFirst({
    where: { id: roadmapId, ...ACTIVE_FILTER },
    select: {
      id: true,
      title: true,
      enrollments: {
        where: {
          userId,
          isDeleted: false,
          status: { not: 'DROPPED' },
        },
        select: { id: true },
        take: 1,
      },
      nodes: {
        where: ACTIVE_FILTER,
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          title: true,
          orderIndex: true,
          personalLearningNotes: {
            where: { userId, ...ACTIVE_FILTER },
            select: {
              id: true,
              content: true,
              createdAt: true,
              updatedAt: true,
            },
            take: 1,
          },
        },
      },
    },
  });
};

exports.findUserForExport = async (userId) => {
  return prisma.user.findFirst({
    where: { id: userId, ...ACTIVE_FILTER },
    select: { id: true, name: true, email: true },
  });
};
