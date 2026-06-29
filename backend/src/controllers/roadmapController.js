const roadmapService = require('../services/roadmapService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

/**
 * POST /api/roadmaps
 * Create a new roadmap (MENTOR only).
 */
exports.createRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await roadmapService.createRoadmap(req.body, req.user.id);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Roadmap created successfully',
    data: roadmap,
  });
});

/**
 * GET /api/roadmaps/mentor
 * Get all roadmaps belonging to the currently logged-in mentor.
 */
exports.getMentorRoadmaps = asyncHandler(async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const take = parseInt(req.query.take) || 20;

  const result = await roadmapService.getMentorRoadmaps(req.user.id, {
    skip,
    take,
  });

  return sendSuccess(res, {
    message: 'Roadmaps retrieved successfully',
    data: result,
  });
});

/**
 * GET /api/roadmaps/:id
 * Get a single roadmap by ID.
 * DRAFT/PENDING are only accessible by the owning mentor or admin.
 */
exports.getRoadmapById = asyncHandler(async (req, res) => {
  const roadmap = await roadmapService.getRoadmapById(
    req.params.id,
    req.user.id,
    req.user.roles
  );

  return sendSuccess(res, {
    message: 'Roadmap retrieved successfully',
    data: roadmap,
  });
});

exports.getRoadmapBySlug = asyncHandler(async (req, res) => {
  const roadmap = await roadmapService.getRoadmapBySlug(
    req.params.slug,
    req.user.id,
    req.user.roles
  );

  return sendSuccess(res, {
    message: 'Roadmap retrieved successfully',
    data: roadmap,
  });
});

/**
 * PUT /api/roadmaps/:id
 * Update a roadmap's info and/or node list (MENTOR owner only).
 */
exports.updateRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await roadmapService.updateRoadmap(
    req.params.id,
    req.body,
    req.user.id
  );

  return sendSuccess(res, {
    message: 'Roadmap updated successfully',
    data: roadmap,
  });
});

/**
 * DELETE /api/roadmaps/:id
 * Soft-delete a roadmap (MENTOR owner only; cannot delete PUBLISHED).
 */
exports.deleteRoadmap = asyncHandler(async (req, res) => {
  await roadmapService.deleteRoadmap(req.params.id, req.user.id);

  return sendSuccess(res, {
    message: 'Roadmap deleted successfully',
  });
});

/**
 * POST /api/roadmaps/:id/submit
 * Submit a DRAFT roadmap for admin review (sets status → PENDING).
 */
exports.submitRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await roadmapService.submitRoadmap(
    req.params.id,
    req.user.id
  );

  return sendSuccess(res, {
    message: 'Roadmap submitted for review successfully',
    data: roadmap,
  });
});

/**
 * GET /api/roadmaps/pending
 * Get all roadmaps pending review (ADMIN only).
 */
exports.getPendingRoadmaps = asyncHandler(async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const take = parseInt(req.query.take) || 20;

  const result = await roadmapService.getPendingRoadmaps({ skip, take });

  return sendSuccess(res, {
    message: 'Pending roadmaps retrieved successfully',
    data: result,
  });
});

/**
 * POST /api/roadmaps/:id/review
 * Approve or Reject a roadmap (ADMIN only).
 */
exports.reviewRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await roadmapService.reviewRoadmap(req.params.id, req.body);

  return sendSuccess(res, {
    message: `Roadmap ${req.body.status.toLowerCase()} successfully`,
    data: roadmap,
  });
});

/**
 * GET /api/roadmaps/stats
 * Get roadmap status counts (ADMIN only).
 */
exports.getRoadmapStats = asyncHandler(async (req, res) => {
  const stats = await roadmapService.getRoadmapStats();

  return sendSuccess(res, {
    message: 'Roadmap statistics retrieved successfully',
    data: stats,
  });
});

/**
 * GET /api/roadmaps/mentor/stats
 * Get mentor dashboard statistics (MENTOR only).
 */
exports.getMentorDashboardStats = asyncHandler(async (req, res) => {
  const stats = await roadmapService.getMentorDashboardStats(req.user.id);

  return sendSuccess(res, {
    message: 'Mentor dashboard stats retrieved successfully',
    data: stats,
  });
});
