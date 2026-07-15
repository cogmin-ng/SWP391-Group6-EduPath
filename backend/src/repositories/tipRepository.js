const prisma = require('../lib/prisma');

const ACTIVE_TIP_FILTER = { isDeleted: false };

exports.findByIdActive = async (id) => {
  return prisma.tip.findFirst({
    where: { id, ...ACTIVE_TIP_FILTER },
    include: {
      node: true,
      createdBy: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      contributor: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  });
};

exports.findByNodeId = async (nodeId) => {
  return prisma.tip.findMany({
    where: { nodeId, ...ACTIVE_TIP_FILTER, isPublished: true },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      contributor: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

exports.findPendingByMentorRoadmap = async (
  mentorId,
  { skip = 0, take = 10 }
) => {
  return prisma.tip.findMany({
    where: {
      ...ACTIVE_TIP_FILTER,
      status: 'PENDING',
      node: {
        learningPath: {
          mentorId,
        },
      },
    },
    include: {
      node: {
        include: {
          learningPath: {
            select: { id: true, title: true },
          },
        },
      },
      createdBy: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      contributor: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });
};

exports.countPendingByMentorRoadmap = async (mentorId) => {
  return prisma.tip.count({
    where: {
      ...ACTIVE_TIP_FILTER,
      status: 'PENDING',
      node: {
        learningPath: {
          mentorId,
        },
      },
    },
  });
};

exports.findByContributor = async (
  contributorId,
  { skip = 0, take = 10, status }
) => {
  return prisma.tip.findMany({
    where: {
      contributorId,
      ...ACTIVE_TIP_FILTER,
      ...(status ? { status } : {}),
    },
    include: {
      node: {
        include: {
          learningPath: {
            select: { id: true, title: true },
          },
        },
      },
      createdBy: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });
};

exports.countByContributor = async (contributorId, status) => {
  return prisma.tip.count({
    where: {
      contributorId,
      ...ACTIVE_TIP_FILTER,
      ...(status ? { status } : {}),
    },
  });
};

exports.countByContributorStatus = async (contributorId) => {
  return prisma.tip.groupBy({
    by: ['status'],
    where: {
      contributorId,
      ...ACTIVE_TIP_FILTER,
    },
    _count: { _all: true },
  });
};

exports.create = async (data) => {
  return prisma.tip.create({
    data,
    include: {
      node: true,
      createdBy: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      contributor: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  });
};

exports.update = async (id, data) => {
  return prisma.tip.update({
    where: { id },
    data,
    include: {
      node: true,
      createdBy: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      contributor: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  });
};

exports.softDelete = async (id) => {
  return prisma.tip.update({
    where: { id },
    data: { isDeleted: true, updatedAt: new Date() },
  });
};

exports.findPendingByNodeAndCreator = async (nodeId, createdById) => {
  return prisma.tip.findMany({
    where: {
      nodeId,
      createdById,
      ...ACTIVE_TIP_FILTER,
      status: 'PENDING',
    },
  });
};

exports.findApprovedByNodeAndCreator = async (nodeId, createdById) => {
  return prisma.tip.findMany({
    where: {
      nodeId,
      createdById,
      ...ACTIVE_TIP_FILTER,
      status: 'APPROVED',
    },
  });
};
