const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultBadges = [
  {
    id: 'badge-streak-7',
    title: 'Consistent Learner',
    description: 'Học tập liên tục đều đặn trong suốt 7 ngày hoặc hoàn thành 7 checklist.',
    xpReward: 100,
    iconName: 'zap',
  },
  {
    id: 'badge-quiz-ace',
    title: 'Thợ Săn Học Thuật',
    description: 'Làm bài kiểm tra (Quiz) đạt số điểm tuyệt đối 100% trong lần đầu thử sức.',
    xpReward: 150,
    iconName: 'award',
  },
  {
    id: 'badge-tip-approved',
    title: 'Ngôi Sao Đóng Góp',
    description: 'Có tối thiểu 1 Tip-trick công nghệ được hội đồng chuyên môn EduPath duyệt.',
    xpReward: 120,
    iconName: 'star',
  },
  {
    id: 'badge-master-fullstack',
    title: 'Docker Master Pro',
    description: 'Hoàn tất toàn bộ các bài học và node thực chiến thuộc lộ trình học.',
    xpReward: 300,
    iconName: 'shield',
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
