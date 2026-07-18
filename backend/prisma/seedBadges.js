const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultBadges = [
  {
    id: 'badge-xp-beginner',
    title: 'Beginner',
    description: 'Đạt mốc 100 XP đầu tiên trên hành trình học tập.',
    xpReward: 0,
    iconName: 'zap',
    badgeType: 'XP',
    unlockThreshold: 100,
  },
  {
    id: 'badge-xp-fast-learner',
    title: 'Fast Learner',
    description: 'Đạt 300 XP và duy trì nhịp học đều đặn.',
    xpReward: 0,
    iconName: 'award',
    badgeType: 'XP',
    unlockThreshold: 300,
  },
  {
    id: 'badge-xp-dedicated-learner',
    title: 'Dedicated Learner',
    description: 'Đạt 500 XP và thể hiện sự kiên trì trong học tập.',
    xpReward: 0,
    iconName: 'star',
    badgeType: 'XP',
    unlockThreshold: 500,
  },
  {
    id: 'badge-xp-master',
    title: 'XP Master',
    description: 'Đạt 1000 XP và trở thành người học bền bỉ nổi bật.',
    xpReward: 0,
    iconName: 'shield',
    badgeType: 'XP',
    unlockThreshold: 1000,
  },
  {
    id: 'badge-first-step',
    title: 'First Step',
    description: 'Hoàn thành node đầu tiên của bạn.',
    xpReward: 0,
    iconName: 'zap',
    badgeType: 'ACHIEVEMENT',
    unlockThreshold: null,
  },
  {
    id: 'badge-path-finisher',
    title: 'Path Finisher',
    description: 'Hoàn thành learning path đầu tiên.',
    xpReward: 0,
    iconName: 'shield',
    badgeType: 'ACHIEVEMENT',
    unlockThreshold: null,
  },
  {
    id: 'badge-contributor',
    title: 'Contributor',
    description: 'Có ít nhất 1 tip được mentor duyệt.',
    xpReward: 0,
    iconName: 'star',
    badgeType: 'ACHIEVEMENT',
    unlockThreshold: null,
  },
  {
    id: 'badge-quiz-ace',
    title: 'Quiz Ace',
    description: 'Đạt 100% điểm quiz ngay ở lần thử đầu tiên.',
    xpReward: 0,
    iconName: 'award',
    badgeType: 'ACHIEVEMENT',
    unlockThreshold: null,
  },
];

async function main() {
  console.log('Seeding badges...');
  for (const badge of defaultBadges) {
    const upserted = await prisma.badge.upsert({
      where: { id: badge.id },
      update: {
        title: badge.title,
        description: badge.description,
        xpReward: badge.xpReward,
        iconName: badge.iconName,
        badgeType: badge.badgeType,
        unlockThreshold: badge.unlockThreshold,
        isDeleted: false,
      },
      create: badge,
    });
    console.log(`Upserted badge: ${upserted.title} (${upserted.id})`);
  }
  console.log('Badges seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
