const nodeCommentService = require('../services/nodeCommentService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.getComments = asyncHandler(async (req, res) => {
  const { nodeId } = req.params;
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 20;

  const { comments, total, totalAll } =
    await nodeCommentService.getCommentsByNode(nodeId, {
      skip,
      take: limit,
    });

  return sendSuccess(res, {
    message: 'Comments retrieved successfully',
    data: { comments, total, totalAll },
  });
});

exports.createComment = asyncHandler(async (req, res) => {
  const { nodeId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const comment = await nodeCommentService.createComment(userId, nodeId, {
    content,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Comment created successfully',
    data: comment,
  });
});

exports.createReply = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const reply = await nodeCommentService.createReply(userId, commentId, {
    content,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Reply created successfully',
    data: reply,
  });
});

exports.updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const comment = await nodeCommentService.updateComment(commentId, userId, {
    content,
  });

  return sendSuccess(res, {
    message: 'Comment updated successfully',
    data: comment,
  });
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  await nodeCommentService.deleteComment(commentId, userId);

  return sendSuccess(res, {
    message: 'Comment deleted successfully',
  });
});
