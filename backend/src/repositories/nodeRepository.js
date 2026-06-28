const prisma = require('../lib/prisma');

const ACTIVE_FILTER = { isDeleted: false };

/**
 * Fetch a node with all its details (checklists, materials, etc.)
 */
exports.findByIdWithDetails = async (id) => {
  return prisma.node.findFirst({
    where: { id, ...ACTIVE_FILTER },
    include: {
      learningPath: {
        select: { id: true, mentorId: true, status: true, isPublic: true },
      },
      checklists: {
        where: ACTIVE_FILTER,
        orderBy: { orderIndex: 'asc' },
      },
      materials: {
        where: ACTIVE_FILTER,
        orderBy: { createdAt: 'asc' },
      },
      quizzes: {
        where: ACTIVE_FILTER,
        orderBy: { createdAt: 'asc' },
        include: {
          questions: {
            where: ACTIVE_FILTER,
            select: { id: true },
          },
        },
      },
      tips: {
        where: ACTIVE_FILTER,
        orderBy: { createdAt: 'desc' },
      },
    },
  });
};

/**
 * Sync Checklists for a Node
 */
exports.syncChecklists = async (nodeId, checklists, tx = prisma) => {
  const existingIds = await tx.checklist
    .findMany({
      where: { nodeId, ...ACTIVE_FILTER },
      select: { id: true },
    })
    .then((rows) => rows.map((r) => r.id));

  const incomingIds = checklists
    .filter((c) => c.id && typeof c.id === 'string' && c.id.length > 0)
    .map((c) => c.id);

  // Soft delete missing checklists
  const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
  if (toDelete.length > 0) {
    await tx.checklist.updateMany({
      where: { id: { in: toDelete } },
      data: { isDeleted: true }, // No updatedAt on Checklist in schema
    });
  }

  // Upsert incoming checklists
  for (let i = 0; i < checklists.length; i++) {
    const item = checklists[i];
    const orderIndex = item.orderIndex !== undefined ? item.orderIndex : i;

    const isExisting = item.id && existingIds.includes(item.id);

    if (isExisting) {
      await tx.checklist.update({
        where: { id: item.id },
        data: {
          title: item.title,
          description: item.description || null,
          orderIndex,
          xpReward: item.xpReward ?? 10,
        },
      });
    } else {
      await tx.checklist.create({
        data: {
          nodeId,
          title: item.title,
          description: item.description || null,
          orderIndex,
          xpReward: item.xpReward ?? 10,
        },
      });
    }
  }
};

/**
 * Sync Materials for a Node
 */
exports.syncMaterials = async (nodeId, materials, tx = prisma) => {
  const existingIds = await tx.material
    .findMany({
      where: { nodeId, ...ACTIVE_FILTER },
      select: { id: true },
    })
    .then((rows) => rows.map((r) => r.id));

  const incomingIds = materials
    .filter((m) => m.id && typeof m.id === 'string' && m.id.length > 0)
    .map((m) => m.id);

  // Soft delete missing materials
  const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
  if (toDelete.length > 0) {
    await tx.material.updateMany({
      where: { id: { in: toDelete } },
      data: { isDeleted: true }, // No updatedAt on Material in schema
    });
  }

  // Upsert incoming materials
  for (const item of materials) {
    const isExisting = item.id && existingIds.includes(item.id);

    if (isExisting) {
      await tx.material.update({
        where: { id: item.id },
        data: {
          title: item.title,
          description: item.description || null,
          url: item.url || '', // Fallback to empty string if no URL provided
          type: item.type,
        },
      });
    } else {
      await tx.material.create({
        data: {
          nodeId,
          title: item.title,
          description: item.description || null,
          url: item.url || '',
          type: item.type,
        },
      });
    }
  }
};
