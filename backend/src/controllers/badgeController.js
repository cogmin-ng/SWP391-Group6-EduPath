const badgeService = require('../services/badgeService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/badges
 * Get all badges for the current authenticated user (with isUnlocked flag).
 */
const prisma = require('../lib/prisma');

exports.getMyBadges = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const badges = await badgeService.getUserBadges(userId);

  // Fetch latest user XP to ensure the frontend displays the correct level and XP
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true },
  });

  return sendSuccess(res, {
    message: 'User badges retrieved successfully',
    data: {
      badges,
      xp: user?.xp ?? 0,
    },
  });
});

/**
 * POST /api/badges/:badgeId/unlock
 * Manually unlock a badge for the current user (e.g. triggered by frontend).
 */
exports.unlockBadge = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { badgeId } = req.params;

  if (!badgeId) {
    throw new ApiError(400, 'Badge ID is required');
  }

  const userBadge = await badgeService.checkAndUnlockBadge(userId, badgeId);

  return sendSuccess(res, {
    message: userBadge ? 'Badge unlocked successfully' : 'Badge already unlocked or does not exist',
    data: userBadge,
  });
});
