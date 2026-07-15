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
    // Check 1: Consistent Learner (badge-streak-7)
    // Criteria: >= 7 completed checklist items in the database
    const completedChecklistsCount = await prisma.checklistProgress.count({
      where: {
        userId,
        completed: true,
        isDeleted: false,
      },
    });
    if (completedChecklistsCount >= 7) {
      await exports.checkAndUnlockBadge(userId, 'badge-streak-7');
    }

    // Check 2: Academic Hunter (badge-quiz-ace)
    // Criteria: At least one quiz attempt with 100% score on the first attempt (attemptCount = 1)
    const aceQuizCount = await prisma.quizAttempt.count({
      where: {
        userId,
        score: 100,
        attemptCount: 1,
        isDeleted: false,
      },
    });
    if (aceQuizCount >= 1) {
      await exports.checkAndUnlockBadge(userId, 'badge-quiz-ace');
    }

    // Check 3: Contribution Star (badge-tip-approved)
    // Criteria: At least one tip-trick contribution approved by a mentor
    const approvedTipsCount = await prisma.tip.count({
      where: {
        contributorId: userId,
        status: 'APPROVED',
        isDeleted: false,
      },
    });
    if (approvedTipsCount >= 1) {
      await exports.checkAndUnlockBadge(userId, 'badge-tip-approved');
    }

    // Check 4: Docker Master Pro (badge-master-fullstack)
    // Criteria: At least one roadmap enrollment completed (status = COMPLETED)
    const completedRoadmapsCount = await prisma.enrollment.count({
      where: {
        userId,
        status: 'COMPLETED',
        isDeleted: false,
      },
    });
    if (completedRoadmapsCount >= 1) {
      await exports.checkAndUnlockBadge(userId, 'badge-master-fullstack');
    }
  } catch (error) {
    console.error('Error running badge checks:', error);
  }
};

/**
 * Unlock a specific badge for a user, award them XP, and notify them.
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

  // Perform unlock transaction: Create UserBadge, award User XP
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create UserBadge
    const userBadge = await tx.userBadge.create({
      data: {
        userId,
        badgeId,
      },
    });

    // 2. Increment user XP
    await tx.user.update({
      where: { id: userId },
      data: {
        xp: {
          increment: badge.xpReward,
        },
      },
    });

    return userBadge;
  });

  // 3. Create a notification for the user
  try {
    await notificationService.createNotification(userId, {
      type: 'SYSTEM',
      title: 'Huy hiệu mới đã mở khoá! 🏆',
      content: `Chúc mừng bạn đã mở khoá thành công huy hiệu "${badge.title}" và nhận được +${badge.xpReward} XP!`,
    });
  } catch (notifError) {
    console.error('Error creating badge notification:', notifError);
  }

  return result;
};
