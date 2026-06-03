const tipService = require('../services/tipService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.submitTip = asyncHandler(async (req, res) => {
  const { nodeId, title, content } = req.body;
  const contributorId = req.user.id;

  const tip = await tipService.submitTip(nodeId, { title, content }, contributorId);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Tip submitted successfully',
    data: tip,
  });
});

exports.getTipsByNode = asyncHandler(async (req, res) => {
  const { nodeId } = req.params;

  const tips = await tipService.getTipsByNode(nodeId);

  return sendSuccess(res, {
    message: 'Tips retrieved successfully',
    data: tips,
  });
});

exports.getPendingTips = asyncHandler(async (req, res) => {
  const { skip, take } = req.query;
  const mentorId = req.user.id;

  const { tips, total } = await tipService.getPendingTipsByMentorRoadmap(
    mentorId,
    {
      skip: Number(skip) || 0,
      take: Number(take) || 10,
    }
  );

  return sendSuccess(res, {
    message: 'Pending tips retrieved successfully',
    data: { tips, total },
  });
});

exports.getContributionHistory = asyncHandler(async (req, res) => {
  const { skip, take } = req.query;
  const contributorId = req.user.id;

  const { tips, total } = await tipService.getTipContributionHistory(
    contributorId,
    {
      skip: Number(skip) || 0,
      take: Number(take) || 10,
    }
  );

  return sendSuccess(res, {
    message: 'Contribution history retrieved successfully',
    data: { tips, total },
  });
});

exports.approveTip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const mentorId = req.user.id;

  const tip = await tipService.approveTip(id, mentorId);

  return sendSuccess(res, {
    message: 'Tip approved successfully',
    data: tip,
  });
});

exports.rejectTip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rejectReason } = req.body;
  const mentorId = req.user.id;

  const tip = await tipService.rejectTip(id, mentorId, rejectReason);

  return sendSuccess(res, {
    message: 'Tip rejected successfully',
    data: tip,
  });
});

exports.getTipById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tip = await tipService.getTipById(id);

  return sendSuccess(res, {
    message: 'Tip retrieved successfully',
    data: tip,
  });
});
