const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');
const nodeRepository = require('../repositories/nodeRepository');

const MSG = {
  notFound: 'Node not found',
  forbidden: 'You do not have permission to access or modify this node',
  cannotEditPublished: 'Cannot edit a node inside a PUBLISHED roadmap',
};

/**
 * Assert the node exists and the mentor owns its roadmap.
 * Returns the node with its learningPath relation attached.
 */
async function assertOwnership(nodeId, userId, roles = []) {
  const node = await nodeRepository.findByIdWithDetails(nodeId);
  if (!node) throw new ApiError(404, MSG.notFound);

  const isOwner = node.learningPath?.mentorId === userId;
  const isAdmin = roles.includes('ADMIN');

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, MSG.forbidden);
  }

  return node;
}

/**
 * Get node details including checklists, materials, quizzes, tips.
 * Accessible by Mentor owner or Admin.
 */
exports.getNodeDetails = async (nodeId, userId, roles = []) => {
  const node = await assertOwnership(nodeId, userId, roles);

  // Remove the learningPath metadata from the response to keep it clean,
  // or keep it if frontend needs it. We'll keep it.
  return node;
};

/**
 * Synchronize node checklists and materials.
 * Only Mentor owner can do this.
 */
exports.syncNodeDetails = async (nodeId, data, mentorId, roles = []) => {
  const node = await assertOwnership(nodeId, mentorId, roles);

  // If roadmap has already been published, prevent editing node details
  if (node.learningPath?.status === 'PUBLISHED') {
    throw new ApiError(400, MSG.cannotEditPublished);
  }

  await prisma.$transaction(async (tx) => {
    if (Array.isArray(data.checklists)) {
      await nodeRepository.syncChecklists(nodeId, data.checklists, tx);
    }

    if (Array.isArray(data.materials)) {
      await nodeRepository.syncMaterials(nodeId, data.materials, tx);
    }
  });

  // Re-fetch to return the updated structure
  return nodeRepository.findByIdWithDetails(nodeId);
};
