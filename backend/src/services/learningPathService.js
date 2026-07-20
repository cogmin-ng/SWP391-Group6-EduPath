const prisma = require('../lib/prisma');
const { summarizeDuration } = require('../utils/duration');

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

exports.getHotLearningPaths = async ({ page = 1, limit = 9 } = {}) => {
  const learningPaths = await prisma.learningPath.findMany({
    where: {
      isDeleted: false,
      OR: [{ status: 'APPROVED' }, { status: 'PUBLISHED' }, { isPublic: true }],
    },
    include: {
      mentor: {
        select: {
          id: true,
          name: true,
          avatar: true,
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
        select: { id: true },
      },
      reviews: {
        where: { isDeleted: false },
        select: { rating: true },
      },
      enrollments: {
        where: { isDeleted: false },
        select: { status: true },
      },
    },
  });

  // Compute popularity score and map data — skip any record with missing required relations
  const scored = learningPaths
    .filter((lp) => lp.mentor && lp.subject && lp.title)
    .map((lp) => {
      const ratings = lp.reviews
        .map((r) => Number(r.rating))
        .filter((r) => Number.isFinite(r));

      const averageRating = ratings.length
        ? Number((ratings.reduce((sum, v) => sum + v, 0) / ratings.length).toFixed(1))
        : 0;

      const totalLearners = lp.enrollments.length;
      const completedCount = lp.enrollments.filter((e) => e.status === 'COMPLETED').length;
      const totalReviews = lp.reviews.length;
      const totalNodes = lp.nodes.length;

      // Popularity score: enrollment weight 3, rating weight 2, completion weight 1
      const score = totalLearners * 3 + averageRating * 2 + completedCount;

      return {
        id: lp.id,
        slug: toSlug(lp.title),
        title: lp.title,
        thumbnail: lp.thumbnail || null,
        description: lp.description || null,
        mentor: {
          id: lp.mentor.id,
          name: lp.mentor.name || '',
          avatar: lp.mentor.avatar || null,
        },
        category: lp.subject.category?.name || 'Uncategorized',
        averageRating: averageRating || null,
        totalLearners,
        totalReviews,
        totalNodes,
        completedCount,
        score,
      };
    });

  // Sort by popularity score descending
  scored.sort((a, b) => b.score - a.score);

  // Paginate
  const total = scored.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * limit;
  const paginated = scored.slice(start, start + limit);

  // Remove internal score from response
  const learningPathsResult = paginated.map(({ score, ...rest }) => rest);

  return {
    learningPaths: learningPathsResult,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
};

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
      _count: {
        select: {
          enrollments: true,
          nodes: true,
        },
      },
    },
    orderBy: [{ isPublic: 'desc' }, { createdAt: 'desc' }],
  });

  return learningPaths.map((learningPath) => {
    const ratings = learningPath.reviews
      .map((review) => Number(review.rating))
      .filter((rating) => Number.isFinite(rating));

    const rating = ratings.length
      ? Number(
        (
          ratings.reduce((sum, value) => sum + value, 0) / ratings.length
        ).toFixed(1)
      )
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
      enrollmentCount: learningPath._count.enrollments,
      nodeCount: learningPath._count.nodes,
    };
  });
};


