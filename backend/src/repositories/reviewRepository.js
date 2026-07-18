const prisma = require('../lib/prisma');

const ACTIVE_FILTER = { isDeleted: false };

const REVIEW_INCLUDE = {
  user: {
    select: { id: true, name: true, email: true, avatar: true },
  },
  learningPath: {
    select: {
      mentor: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  },
};

exports.findByLearningPathId = async (learningPathId, { skip = 0, take = 20 } = {}) => {
  return prisma.review.findMany({
    where: { learningPathId, ...ACTIVE_FILTER },
    include: REVIEW_INCLUDE,
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });
};

exports.countByLearningPathId = async (learningPathId) => {
  return prisma.review.count({
    where: { learningPathId, ...ACTIVE_FILTER },
  });
};

exports.findById = async (id) => {
  return prisma.review.findFirst({
    where: { id, ...ACTIVE_FILTER },
    include: REVIEW_INCLUDE,
  });
};

exports.findByUserAndLearningPath = async (userId, learningPathId) => {
  return prisma.review.findFirst({
    where: { userId, learningPathId, ...ACTIVE_FILTER },
    include: REVIEW_INCLUDE,
  });
};

exports.create = async (data) => {
  return prisma.review.create({
    data,
    include: REVIEW_INCLUDE,
  });
};

exports.update = async (id, data) => {
  return prisma.review.update({
    where: { id },
    data,
    include: REVIEW_INCLUDE,
  });
};

exports.softDelete = async (id) => {
  return prisma.review.update({
    where: { id },
    data: { isDeleted: true, updatedAt: new Date() },
  });
};
