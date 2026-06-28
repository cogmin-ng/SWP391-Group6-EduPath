const nodeService = require('../services/nodeService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

/**
 * GET /api/nodes/:id
 * Retrieve full node details including checklists, materials, quizzes, tips.
 */
exports.getNodeDetails = asyncHandler(async (req, res) => {
  const node = await nodeService.getNodeDetails(
    req.params.id,
    req.user.id,
    req.user.roles
  );

  return sendSuccess(res, {
    message: 'Node details retrieved successfully',
    data: node,
  });
});

/**
 * PUT /api/nodes/:id/details
 * Synchronize node checklists and materials (create, update, delete).
 */
exports.syncNodeDetails = asyncHandler(async (req, res) => {
  const node = await nodeService.syncNodeDetails(
    req.params.id,
    req.body,
    req.user.id,
    req.user.roles
  );

  return sendSuccess(res, {
    message: 'Node details synchronized successfully',
    data: node,
  });
});

exports.toggleChecklistProgress = asyncHandler(async (req, res) => {
  const node = await nodeService.toggleChecklistProgress(
    req.params.id,
    req.params.checklistId,
    req.body.completed,
    req.user.id,
    req.user.roles
  );

  return sendSuccess(res, {
    message: 'Checklist progress updated successfully',
    data: node,
  });
});

exports.updateNodeProgress = asyncHandler(async (req, res) => {
  const progress = await nodeService.updateNodeProgress(
    req.params.id,
    req.body.completed,
    req.user.id,
    req.user.roles
  );

  return sendSuccess(res, {
    message: 'Node progress updated successfully',
    data: progress,
  });
});
