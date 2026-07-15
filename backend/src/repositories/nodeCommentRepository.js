const prisma = require('../lib/prisma');

const ACTIVE_FILTER = { isDeleted: false };

const USER_SELECT = {
  id: true,
  name: true,
  avatar: true,
  role: { select: { name: true } },
};

const COMMENT_INCLUDE = {
  user: { select: USER_SELECT },
  replies: {
    where: ACTIVE_FILTER,
    include: { user: { select: USER_SELECT } },
    orderBy: { createdAt: 'asc' },
  },
};

/**
 * Find root comments (parentId = null) for a node, newest first.
 * Each comment includes its active replies + user info.
 */
exports.findByNodeId = async (nodeId, { skip = 0, take = 20 } = {}) => {
  return prisma.nodeComment.findMany({
    where: { nodeId, parentId: null, ...ACTIVE_FILTER },
    include: COMMENT_INCLUDE,
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });
};

/**
 * Count root (non-reply) active comments for a node.
 */
exports.countByNodeId = async (nodeId) => {
  return prisma.nodeComment.count({
    where: { nodeId, parentId: null, ...ACTIVE_FILTER },
  });
};

/**
 * Count ALL active comments (root + replies) for a node — used for badge count.
 */
exports.countAllByNodeId = async (nodeId) => {
  return prisma.nodeComment.count({
    where: { nodeId, ...ACTIVE_FILTER },
  });
};

/**
 * Find a single comment by id (not soft-deleted).
 */
exports.findById = async (id) => {
  return prisma.nodeComment.findFirst({
    where: { id, ...ACTIVE_FILTER },
    include: { user: { select: USER_SELECT } },
  });
};

/**
 * Find a comment by id regardless of soft-delete status (for reply validation).
 */
exports.findByIdIncludeDeleted = async (id) => {
  return prisma.nodeComment.findFirst({
    where: { id },
    include: { user: { select: USER_SELECT } },
  });
};

/**
 * Create a new comment or reply.
 */
exports.create = async (data) => {
  return prisma.nodeComment.create({
    data,
    include: {
      user: { select: USER_SELECT },
      replies: {
        where: ACTIVE_FILTER,
        include: { user: { select: USER_SELECT } },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
};

/**
 * Update a comment's content.
 */
exports.update = async (id, data) => {
  return prisma.nodeComment.update({
    where: { id },
    data,
    include: { user: { select: USER_SELECT } },
  });
};

/**
 * Soft-delete a comment.
 */
exports.softDelete = async (id) => {
  return prisma.nodeComment.update({
    where: { id },
    data: { isDeleted: true, updatedAt: new Date() },
  });
};
