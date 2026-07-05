const prisma = require('../lib/prisma');
const { summarizeDuration } = require('../utils/duration');

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

exports.getExploreLearningPaths = async () => {
  const learningPaths = await prisma.learningPath.findMany({
    where: {
      isDeleted: false,
      OR: [{ status: 'APPROVED' }, { status: 'PUBLISHED' }, { isPublic: true }],
    },
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
      nodes: {
        where: { isDeleted: false },
        select: { duration: true },
      },
      reviews: {
        where: { isDeleted: false },
        select: { rating: true },
      },
    },
    orderBy: [
      { isPublic: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return learningPaths.map((learningPath) => {
    const ratings = learningPath.reviews
      .map((review) => Number(review.rating))
      .filter((rating) => Number.isFinite(rating));

    const rating = ratings.length
      ? Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1))
      : null;

    const duration = summarizeDuration(
      learningPath.nodes
        .filter(Boolean)
        .map((node) => node.duration)
        .filter(Boolean)
    );

    return {
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
      rating,
      duration: duration || 'N/A',
    };
  });
};
