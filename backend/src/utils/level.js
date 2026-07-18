function getLevelInfo(totalXp = 0) {
  const xp = Math.max(0, Number(totalXp) || 0);
  const level = Math.floor(xp / 100) + 1;
  const currentLevelXp = (level - 1) * 100;
  const nextLevelXp = level * 100;

  return {
    level,
    currentLevelXp,
    nextLevelXp,
    xpToNextLevel: nextLevelXp - xp,
    progressPercent: Math.min(
      100,
      Math.max(0, Math.round(((xp - currentLevelXp) / 100) * 100))
    ),
  };
}

module.exports = {
  getLevelInfo,
};
