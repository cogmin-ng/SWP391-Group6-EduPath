const prisma = require('../lib/prisma');

const activeEnrollmentWhere = (mentorId) => ({
  isDeleted: false,
  status: { not: 'DROPPED' },
  learningPath: {
    mentorId,
    isDeleted: false,
  },
  user: {
    isDeleted: false,
    role: { name: 'MENTEE' },
  },
});

exports.findPage = async (mentorId, { skip, take, search, status }) => {
  const where = {
    ...activeEnrollmentWhere(mentorId),
    ...(status ? { status } : {}),
    ...(search
      ? {
          user: {
            isDeleted: false,
            role: { name: 'MENTEE' },
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
        }
      : {}),
  };

  const [enrollments, total] = await Promise.all([
    prisma.enrollment.findMany({
      where,
      select: {
        id: true,
        progressPercent: true,
        status: true,
        enrolledAt: true,
        lastActivityAt: true,
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        learningPath: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: [{ lastActivityAt: 'desc' }, { enrolledAt: 'desc' }],
      skip,
      take,
    }),
    prisma.enrollment.count({ where }),
  ]);

  return { enrollments, total };
};

exports.findLearningDetails = async (learningPathIds, userIds) => {
  if (!learningPathIds.length || !userIds.length) return [];

  return prisma.learningPath.findMany({
    where: { id: { in: learningPathIds }, isDeleted: false },
    select: {
      id: true,
      nodes: {
        where: { isDeleted: false },
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          title: true,
          orderIndex: true,
          nodeProgresses: {
            where: { userId: { in: userIds }, isDeleted: false },
            select: { userId: true, completed: true },
          },
          quizzes: {
            where: { isDeleted: false },
            select: {
              id: true,
              attempts: {
                where: {
                  userId: { in: userIds },
                  isDeleted: false,
                  status: 'PASS',
                },
                select: { userId: true },
              },
            },
          },
        },
      },
      certificates: {
        where: { userId: { in: userIds }, isDeleted: false },
        select: { id: true, userId: true, issuedAt: true },
      },
    },
  });
};

exports.findStatsRows = async (mentorId) => {
  return prisma.enrollment.findMany({
    where: activeEnrollmentWhere(mentorId),
    select: { userId: true, status: true },
  });
};

exports.findOwnedEnrollment = async (enrollmentId, mentorId) => {
  return prisma.enrollment.findFirst({
    where: {
      id: enrollmentId,
      ...activeEnrollmentWhere(mentorId),
    },
    select: {
      id: true,
      userId: true,
      user: { select: { id: true, name: true, email: true } },
      learningPath: { select: { id: true, title: true } },
    },
  });
};
