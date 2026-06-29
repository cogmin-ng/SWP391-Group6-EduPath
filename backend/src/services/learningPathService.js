const prisma = require('../lib/prisma');

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

exports.getExploreLearningPaths = async () => {
  const learningPaths = await prisma.learningPath.findMany({
    where: { isDeleted: false },
    include: {
      mentor: {
        select: {
          name: true,
        },
      },
      subject: {
        select: {
          name: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: [
      { isPublic: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return learningPaths.map((learningPath) => ({
    id: learningPath.id,
    slug: toSlug(learningPath.title),
    title: learningPath.title,
    description: learningPath.description,
    cover: learningPath.thumbnail,
    mentor: learningPath.mentor.name,
    subject: learningPath.subject.name,
    category: learningPath.subject.category?.name || 'Uncategorized',
    status: learningPath.status,
    isPublic: learningPath.isPublic,
    xpReward: learningPath.xpReward,
  }));
};
