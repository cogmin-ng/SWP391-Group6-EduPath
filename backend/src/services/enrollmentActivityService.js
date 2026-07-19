const prisma = require('../lib/prisma');

/**
 * Record a meaningful learning action without reviving a deleted or dropped
 * enrollment. Accepting a transaction client keeps the activity timestamp
 * atomic with the learning action that caused it.
 */
exports.touch = async (
  userId,
  learningPathId,
  prismaClient = prisma,
  occurredAt = new Date()
) => {
  if (!userId || !learningPathId) return { count: 0 };

  return prismaClient.enrollment.updateMany({
    where: {
      userId,
      learningPathId,
      isDeleted: false,
      status: { not: 'DROPPED' },
    },
    data: { lastActivityAt: occurredAt },
  });
};
