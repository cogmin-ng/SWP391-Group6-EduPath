const ApiError = require('../utils/ApiError');
const nodeCommentRepository = require('../repositories/nodeCommentRepository');

const MSG = {
  notFound: 'Comment not found',
  forbidden: 'You do not have permission to perform this action',
  parentNotFound: 'Parent comment not found',
  parentIsReply: 'Cannot reply to a reply — only 1 level of nesting is allowed',
  parentNodeMismatch: 'Parent comment does not belong to this node',
  emptyContent: 'Comment content cannot be empty',
};

// ─── READ ────────────────────────────────────────────────

exports.getCommentsByNode = async (nodeId, { skip = 0, take = 20 } = {}) => {
  const [comments, total, totalAll] = await Promise.all([
    nodeCommentRepository.findByNodeId(nodeId, { skip, take }),
    nodeCommentRepository.countByNodeId(nodeId),
    nodeCommentRepository.countAllByNodeId(nodeId),
  ]);

  return { comments, total, totalAll };
};

// ─── CREATE COMMENT ──────────────────────────────────────

exports.createComment = async (userId, nodeId, { content }) => {
  return nodeCommentRepository.create({
    userId,
    nodeId,
    content: content.trim(),
  });
};

// ─── CREATE REPLY ────────────────────────────────────────

exports.createReply = async (userId, commentId, { content }) => {
  // Validate parent exists (allow replying even if parent is soft-deleted,
  // but we check it exists at all)
  const parent = await nodeCommentRepository.findByIdIncludeDeleted(commentId);
  if (!parent) throw new ApiError(404, MSG.parentNotFound);

  // Only 1 level of nesting — parent must be a root comment
  if (parent.parentId) throw new ApiError(400, MSG.parentIsReply);

  return nodeCommentRepository.create({
    userId,
    nodeId: parent.nodeId,
    parentId: commentId,
    content: content.trim(),
  });
};

// ─── UPDATE ──────────────────────────────────────────────

exports.updateComment = async (commentId, userId, { content }) => {
  const comment = await nodeCommentRepository.findById(commentId);
  if (!comment) throw new ApiError(404, MSG.notFound);

  if (comment.userId !== userId) throw new ApiError(403, MSG.forbidden);

  return nodeCommentRepository.update(commentId, { content: content.trim() });
};

// ─── DELETE (soft) ───────────────────────────────────────

exports.deleteComment = async (commentId, userId) => {
  const comment = await nodeCommentRepository.findById(commentId);
  if (!comment) throw new ApiError(404, MSG.notFound);

  if (comment.userId !== userId) throw new ApiError(403, MSG.forbidden);

  return nodeCommentRepository.softDelete(commentId);
};
