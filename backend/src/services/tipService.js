const tipRepository = require('../repositories/tipRepository');
const notificationService = require('./notificationService');
const ApiError = require('../utils/ApiError');
const prisma = require('../lib/prisma');

const tipMessages = {
  notFound: 'Tip not found',
  nodeNotFound: 'Node not found',
  invalidId: 'Invalid tip id',
  notEnrolled: 'You are not enrolled in this learning path',
  permissionDenied: 'You do not have permission to perform this action',
  alreadyApproved: 'This tip is already approved',
  alreadyRejected: 'This tip is already rejected',
};

exports.submitTip = async (nodeId, { title, content }, contributorId) => {
  if (!nodeId || typeof nodeId !== 'string') {
    throw new ApiError(400, 'Invalid node id');
  }

  // Verify node exists and get learning path
  const node = await prisma.node.findFirst({
    where: { id: nodeId, isDeleted: false },
    include: { learningPath: true },
  });

  if (!node) {
    throw new ApiError(404, tipMessages.nodeNotFound);
  }

  // Verify contributor is enrolled in this learning path
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: contributorId,
      learningPathId: node.learningPathId,
      status: 'ACTIVE',
    },
  });

  if (!enrollment) {
    throw new ApiError(403, tipMessages.notEnrolled);
  }

  // Create tip with PENDING status
  const tip = await tipRepository.create({
    nodeId,
    title,
    content,
    createdById: node.learningPath.mentorId, // Mentor is the creator
    contributorId,
    status: 'PENDING',
  });

  // Create notification for mentor about new tip submission
  await notificationService.createNotification(node.learningPath.mentorId, {
    type: 'CONTRIBUTION',
    title: 'Tip mới cần duyệt',
    content: `Một tip mới cho node "${node.title}" vừa được gửi bởi học viên. Vui lòng xem xét trước khi công bố.`,
    relatedTipId: tip.id,
  });

  return tip;
};

exports.getTipsByNode = async (nodeId) => {
  const tips = await tipRepository.findByNodeId(nodeId);
  return tips;
};

exports.getPendingTipsByMentorRoadmap = async (
  mentorId,
  { skip = 0, take = 10 }
) => {
  const [tips, total] = await Promise.all([
    tipRepository.findPendingByMentorRoadmap(mentorId, { skip, take }),
    tipRepository.countPendingByMentorRoadmap(mentorId),
  ]);

  return { tips, total };
};

exports.getTipContributionHistory = async (
  contributorId,
  { skip = 0, take = 10 }
) => {
  const [tips, total] = await Promise.all([
    tipRepository.findByContributor(contributorId, { skip, take }),
    tipRepository.countByContributor(contributorId),
  ]);

  return { tips, total };
};

exports.approveTip = async (tipId, mentorId) => {
  if (!tipId || typeof tipId !== 'string') {
    throw new ApiError(400, tipMessages.invalidId);
  }

  const tip = await tipRepository.findByIdActive(tipId);
  if (!tip) {
    throw new ApiError(404, tipMessages.notFound);
  }

  // Verify mentor owns this roadmap
  const roadmap = await prisma.learningPath.findFirst({
    where: { id: tip.node.learningPathId, mentorId },
  });

  if (!roadmap) {
    throw new ApiError(403, tipMessages.permissionDenied);
  }

  if (tip.status !== 'PENDING') {
    throw new ApiError(400, `Tip status is ${tip.status}, cannot approve`);
  }

  // Update tip status to APPROVED and mark as published
  const updatedTip = await tipRepository.update(tipId, {
    status: 'APPROVED',
    reviewedBy: mentorId,
    reviewedAt: new Date(),
    isPublished: true,
    publishedAt: new Date(),
  });

  // Create notification for contributor/mentee about approval
  if (updatedTip.contributorId) {
    await notificationService.createNotification(updatedTip.contributorId, {
      type: 'CONTRIBUTION',
      title: 'Tip của bạn đã được duyệt',
      content: `Tip của bạn cho node "${
        updatedTip.node?.title || 'một node'
      }" đã được mentor phê duyệt và công bố thành công.`,
      relatedTipId: updatedTip.id,
    });
  }

  return updatedTip;
};

exports.rejectTip = async (tipId, mentorId, rejectReason) => {
  if (!tipId || typeof tipId !== 'string') {
    throw new ApiError(400, tipMessages.invalidId);
  }

  const tip = await tipRepository.findByIdActive(tipId);
  if (!tip) {
    throw new ApiError(404, tipMessages.notFound);
  }

  // Verify mentor owns this roadmap
  const roadmap = await prisma.learningPath.findFirst({
    where: { id: tip.node.learningPathId, mentorId },
  });

  if (!roadmap) {
    throw new ApiError(403, tipMessages.permissionDenied);
  }

  if (tip.status !== 'PENDING') {
    throw new ApiError(400, `Tip status is ${tip.status}, cannot reject`);
  }

  // Update tip status to REJECTED with reason
  const updatedTip = await tipRepository.update(tipId, {
    status: 'REJECTED',
    reviewedBy: mentorId,
    reviewedAt: new Date(),
    rejectReason,
  });

  // Create notification for contributor/mentee about rejection with reason
  if (updatedTip.contributorId) {
    await notificationService.createNotification(updatedTip.contributorId, {
      type: 'CONTRIBUTION',
      title: 'Tip của bạn đã bị từ chối',
      content: `Tip của bạn cho node "${
        updatedTip.node?.title || 'một node'
      }" đã bị mentor từ chối.${rejectReason ? ` Lý do: ${rejectReason}` : ''}`,
      relatedTipId: updatedTip.id,
    });
  }

  return updatedTip;
};

exports.getTipById = async (tipId) => {
  if (!tipId || typeof tipId !== 'string') {
    throw new ApiError(400, tipMessages.invalidId);
  }

  const tip = await tipRepository.findByIdActive(tipId);
  if (!tip) {
    throw new ApiError(404, tipMessages.notFound);
  }

  return tip;
};
