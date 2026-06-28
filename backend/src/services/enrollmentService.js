const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');
const {
  findLearningPathIdBySlug,
  toRoadmapSlug,
} = require('../utils/roadmapSlug');

async function getLearningPathBySlug(slug) {
  const learningPathId = await findLearningPathIdBySlug(slug);
  if (!learningPathId) {
    throw new ApiError(404, 'Roadmap not found');
  }

  const learningPath = await prisma.learningPath.findFirst({
    where: { id: learningPathId, isDeleted: false },
    select: {
      id: true,
      title: true,
      status: true,
      isPublic: true,
      mentorId: true,
    },
  });

  if (!learningPath) {
    throw new ApiError(404, 'Roadmap not found');
  }

  return learningPath;
}

function assertPublicRoadmap(learningPath) {
  const isVisible =
    learningPath.isPublic ||
    learningPath.status === 'APPROVED' ||
    learningPath.status === 'PUBLISHED';

  if (!isVisible) {
    throw new ApiError(403, 'This roadmap is not open for enrollment');
  }
}

exports.enrollBySlug = async (slug, userId) => {
  const learningPath = await getLearningPathBySlug(slug);
  assertPublicRoadmap(learningPath);

  const existing = await prisma.enrollment.findFirst({
    where: {
      userId,
      learningPathId: learningPath.id,
      isDeleted: false,
    },
  });

  if (existing) {
    return {
      ...existing,
      slug: toRoadmapSlug(learningPath.title),
    };
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId,
      learningPathId: learningPath.id,
      progressPercent: 0,
      status: 'ACTIVE',
    },
  });

  return {
    ...enrollment,
    slug: toRoadmapSlug(learningPath.title),
  };
};

exports.getMyEnrollmentBySlug = async (slug, userId) => {
  const learningPath = await getLearningPathBySlug(slug);

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      learningPathId: learningPath.id,
      isDeleted: false,
    },
  });

  if (!enrollment) {
    return null;
  }

  return {
    ...enrollment,
    slug: toRoadmapSlug(learningPath.title),
  };
};

exports.updateEnrollmentProgressBySlug = async (
  slug,
  userId,
  progressPercent
) => {
  const learningPath = await getLearningPathBySlug(slug);

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      learningPathId: learningPath.id,
      isDeleted: false,
    },
  });

  if (!enrollment) {
    throw new ApiError(404, 'Enrollment not found');
  }

  const normalizedProgress = Math.max(
    0,
    Math.min(100, Number(progressPercent) || 0)
  );
  const updated = await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progressPercent: normalizedProgress,
      status: normalizedProgress >= 100 ? 'COMPLETED' : 'ACTIVE',
    },
  });

  return {
    ...updated,
    slug: toRoadmapSlug(learningPath.title),
  };
};

exports.getMyEnrollments = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    include: {
      learningPath: {
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          status: true,
          mentor: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return enrollments.map((en) => ({
    ...en,
    slug: toRoadmapSlug(en.learningPath.title),
    title: en.learningPath.title,
    description: en.learningPath.description,
    thumbnail: en.learningPath.thumbnail,
    mentorName: en.learningPath.mentor?.name || 'Unknown',
  }));
};
