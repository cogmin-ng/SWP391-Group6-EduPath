const prisma = require('../lib/prisma');
const notificationService = require('./notificationService');

/**
 * Get all badges and flag whether they are unlocked for the user.
 * Also runs badge qualification checks before returning.
 */
exports.getUserBadges = async (userId) => {
  // 1. Run automatic checks to unlock new qualifying badges
  await exports.runBadgeChecks(userId);

  // 2. Fetch all active badges
  const allBadges = await prisma.badge.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'asc' },
  });

  // 3. Fetch user's unlocked badges
  const unlockedBadges = await prisma.userBadge.findMany({
    where: { userId, isDeleted: false },
  });

  const unlockedMap = new Map(
    unlockedBadges.map((ub) => [ub.badgeId, ub.unlockedAt])
  );

  // 4. Map badges together
  return allBadges.map((badge) => {
    const isUnlocked = unlockedMap.has(badge.id);
    return {
      id: badge.id,
      title: badge.title,
      description: badge.description,
      xpReward: badge.xpReward,
      badgeType: badge.badgeType,
      unlockThreshold: badge.unlockThreshold,
      isUnlocked,
      iconName: badge.iconName,
      unlockedDate: isUnlocked ? unlockedMap.get(badge.id) : null,
    };
  });
};

/**
 * Check if the user is qualified for each of the 4 badges, and unlock them if so.
 */
exports.runBadgeChecks = async (userId) => {
  try {
    const [user, completedNodesCount, aceQuizCount, approvedTipsCount, completedRoadmapsCount] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { xp: true },
        }),
        prisma.nodeProgress.count({
          where: {
            userId,
            completed: true,
            isDeleted: false,
          },
        }),
        prisma.quizAttempt.count({
          where: {
            userId,
            score: 100,
            attemptCount: 1,
            isDeleted: false,
          },
        }),
        prisma.tip.count({
          where: {
            contributorId: userId,
            status: 'APPROVED',
            isDeleted: false,
          },
        }),
        prisma.enrollment.count({
          where: {
            userId,
            status: 'COMPLETED',
            isDeleted: false,
          },
        }),
      ]);

    const xp = user?.xp ?? 0;

    if (xp >= 100) {
      await exports.checkAndUnlockBadge(userId, 'badge-xp-beginner');
    }

    if (xp >= 300) {
      await exports.checkAndUnlockBadge(userId, 'badge-xp-fast-learner');
    }

    if (xp >= 500) {
      await exports.checkAndUnlockBadge(userId, 'badge-xp-dedicated-learner');
    }

    if (xp >= 1000) {
      await exports.checkAndUnlockBadge(userId, 'badge-xp-master');
    }

    if (completedNodesCount >= 1) {
      await exports.checkAndUnlockBadge(userId, 'badge-first-step');
    }

    if (aceQuizCount >= 1) {
      await exports.checkAndUnlockBadge(userId, 'badge-quiz-ace');
    }

    if (approvedTipsCount >= 1) {
      await exports.checkAndUnlockBadge(userId, 'badge-contributor');
    }

    if (completedRoadmapsCount >= 1) {
      await exports.checkAndUnlockBadge(userId, 'badge-path-finisher');
    }
  } catch (error) {
    console.error('Error running badge checks:', error);
  }
};

/**
 * Unlock a specific badge for a user and notify them.
 */
exports.checkAndUnlockBadge = async (userId, badgeId) => {
  // Check if already unlocked
  const existing = await prisma.userBadge.findFirst({
    where: {
      userId,
      badgeId,
      isDeleted: false,
    },
  });

  if (existing) {
    return existing;
  }

  // Get badge info
  const badge = await prisma.badge.findUnique({
    where: { id: badgeId },
  });

  if (!badge) {
    return null;
  }

  const result = await prisma.userBadge.create({
    data: {
      userId,
      badgeId,
    },
  });

  // 3. Create a notification for the user
  try {
    await notificationService.createNotification(userId, {
      type: 'SYSTEM',
      title: 'Huy hiệu mới đã mở khoá! 🏆',
      content: `Chúc mừng bạn đã mở khoá thành công huy hiệu "${badge.title}"!`,
    });
  } catch (notifError) {
    console.error('Error creating badge notification:', notifError);
  }

  return result;
};
