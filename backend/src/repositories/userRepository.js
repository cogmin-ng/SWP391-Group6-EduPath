const prisma = require('../lib/prisma');
const normalizeEmail = require('../utils/normalizeEmail');

const ACTIVE_USER_FILTER = { isDeleted: false };

exports.findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
};

exports.findByEmailActive = async (email) => {
  return prisma.user.findFirst({
    where: { email: normalizeEmail(email), ...ACTIVE_USER_FILTER },
  });
};

exports.create = async ({ email, passwordHash, name, roleId }) => {
  const data = { email: normalizeEmail(email), passwordHash, name };
  if (roleId) {
    data.role = { connect: { id: roleId } };
  }
  return prisma.user.create({ data });
};

exports.findById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

exports.findByIdActive = async (id) => {
  return prisma.user.findFirst({
    where: { id, ...ACTIVE_USER_FILTER },
  });
};

exports.findByIdWithRole = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: { role: { select: { name: true } } },
  });
};

exports.findByIdWithRoles = async (id) => {
  return prisma.user.findFirst({
    where: { id, ...ACTIVE_USER_FILTER },
    include: { role: true },
  });
};

exports.findAll = async ({ skip = 0, take = 10 } = {}) => {
  return prisma.user.findMany({
    where: ACTIVE_USER_FILTER,
    include: {
      role: true,
    },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });
};

exports.count = async () => {
  return prisma.user.count({ where: ACTIVE_USER_FILTER });
};

exports.search = async ({ query, skip = 0, take = 10 }) => {
  return prisma.user.findMany({
    where: {
      ...ACTIVE_USER_FILTER,
      OR: [
        { email: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      role: true,
    },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });
};

exports.searchCount = async (query) => {
  return prisma.user.count({
    where: {
      ...ACTIVE_USER_FILTER,
      OR: [
        { email: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
      ],
    },
  });
};

exports.update = async (id, data, tx = prisma) => {
  return tx.user.update({
    where: { id },
    data,
  });
};

exports.softDelete = async (id, data = {}, tx = prisma) => {
  return tx.user.update({
    where: { id },
    data: { isDeleted: true, updatedAt: new Date(), ...data },
  });
};

exports.hardDelete = async (id, tx = prisma) => {
  return tx.user.delete({
    where: { id },
  });
};

exports.markVerified = async (id, tx = prisma) => {
  return tx.user.update({
    where: { id },
    data: { isVerified: true, updatedAt: new Date() },
  });
};

/**
 * Fetch hot mentors with aggregated stats
 * Mentors are sorted by: total learners > avg rating > total learning paths
 */
exports.getHotMentors = async ({ page = 1, limit = 9 } = {}) => {
  // Get all mentors with their learning paths and stats
  const mentors = await prisma.user.findMany({
    where: {
      isDeleted: false,
      status: 'ACTIVE',
      learningPaths: {
        some: {
          isDeleted: false,
          OR: [
            { status: 'APPROVED' },
            { status: 'PUBLISHED' },
            { isPublic: true },
          ],
        },
      },
      // User must have an approved advisor application
      advisorApplications: {
        some: {
          status: 'APPROVED',
          isDeleted: false,
        },
      },
    },
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
      createdAt: true,
      learningPaths: {
        where: {
          isDeleted: false,
          OR: [
            { status: 'APPROVED' },
            { status: 'PUBLISHED' },
            { isPublic: true },
          ],
        },
        select: {
          id: true,
          reviews: {
            where: { isDeleted: false },
            select: { rating: true },
          },
          enrollments: {
            where: { isDeleted: false },
            select: { id: true },
          },
        },
      },
      advisorApplications: {
        where: { status: 'APPROVED', isDeleted: false },
        select: {
          mentorSubjects: {
            select: {
              subject: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Process and calculate stats for each mentor
  const processedMentors = mentors
    .map((mentor) => {
      const learningPaths = mentor.learningPaths || [];

      // Aggregate enrollment counts
      let totalLearners = 0;
      let totalReviews = 0;
      let ratingSum = 0;

      learningPaths.forEach((lp) => {
        totalLearners += (lp.enrollments || []).length;
        const reviews = lp.reviews || [];
        totalReviews += reviews.length;
        reviews.forEach((review) => {
          ratingSum += Number(review.rating) || 0;
        });
      });

      const averageRating =
        totalReviews > 0 ? parseFloat((ratingSum / totalReviews).toFixed(1)) : 0;

      // Extract unique subjects from advisor application
      const subjectsSet = new Set();
      const subjects = [];
      (mentor.advisorApplications || []).forEach((app) => {
        (app.mentorSubjects || []).forEach((ms) => {
          if (ms.subject && !subjectsSet.has(ms.subject.id)) {
            subjectsSet.add(ms.subject.id);
            subjects.push({
              id: ms.subject.id,
              name: ms.subject.name,
            });
          }
        });
      });

      return {
        id: mentor.id,
        fullName: mentor.name || '',
        avatar: mentor.avatar || null,
        bio: mentor.bio || null,
        averageRating,
        totalLearners,
        totalLearningPaths: learningPaths.length,
        totalReviews,
        subjects,
        createdAt: mentor.createdAt,
        // Score for sorting: learners (weight 3) + rating (weight 2) + paths (weight 1)
        score: totalLearners * 3 + averageRating * 2 + learningPaths.length,
      };
    })
    .filter((m) => m.totalLearningPaths > 0) // Only mentors with at least 1 learning path
    .sort((a, b) => {
      // Sort by learners first (descending)
      if (b.totalLearners !== a.totalLearners)
        return b.totalLearners - a.totalLearners;
      // Then by rating (descending)
      if (b.averageRating !== a.averageRating)
        return b.averageRating - a.averageRating;
      // Then by learning paths (descending)
      return b.totalLearningPaths - a.totalLearningPaths;
    });

  // Paginate
  const total = processedMentors.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * limit;
  const paginated = processedMentors.slice(start, start + limit);

  return {
    mentors: paginated,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
};
