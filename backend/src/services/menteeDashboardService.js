const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');
const { toRoadmapSlug } = require('../utils/roadmapSlug');
const { getLevelInfo } = require('../utils/level');

function normalizePeriod(period) {
  return period === 'month' ? 'month' : 'week';
}

function getPeriodStart(period) {
  const now = new Date();

  if (period === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  }

  const start = new Date(now);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function mapEnrollment(enrollment) {
  const completedNodeIds = new Set(
    enrollment.learningPath.nodes
      .filter((node) => node.completed)
      .map((node) => node.id)
  );
  const currentNode =
    enrollment.learningPath.nodes.find(
      (node) => !completedNodeIds.has(node.id)
    ) ||
    enrollment.learningPath.nodes.at(-1) ||
    null;

  return {
    id: enrollment.id,
    learningPathId: enrollment.learningPath.id,
    slug: toRoadmapSlug(enrollment.learningPath.title),
    title: enrollment.learningPath.title,
    description: enrollment.learningPath.description,
    thumbnail: enrollment.learningPath.thumbnail,
    mentorName: enrollment.learningPath.mentor?.name || 'Chưa cập nhật',
    subjectName: enrollment.learningPath.subject?.name || 'Chưa phân loại',
    progressPercent: Number(enrollment.progressPercent) || 0,
    status: enrollment.status,
    enrolledAt: enrollment.enrolledAt,
    nodeCount: enrollment.learningPath.nodes.length,
    completedNodeCount: completedNodeIds.size,
    currentNode: currentNode
      ? {
          id: currentNode.id,
          title: currentNode.title,
          hasQuiz: currentNode.hasQuiz,
        }
      : null,
  };
}

async function getEnrollmentRows(userId) {
  const rows = await prisma.$queryRaw(Prisma.sql`
    SELECT
      e.id,
      e."progressPercent",
      e.status,
      e."enrolledAt",
      json_build_object(
        'id', lp.id,
        'title', lp.title,
        'description', lp.description,
        'thumbnail', lp.thumbnail,
        'mentorName', mentor.name,
        'subjectName', subject.name,
        'nodes', COALESCE((
          SELECT json_agg(
            json_build_object(
              'id', node.id,
              'title', node.title,
              'completed', EXISTS (
                SELECT 1
                FROM "NodeProgress" progress
                WHERE progress."nodeId" = node.id
                  AND progress."userId" = ${userId}
                  AND progress."isDeleted" = false
                  AND progress.completed = true
              ),
              'hasQuiz', EXISTS (
                SELECT 1
                FROM "Quiz" quiz
                WHERE quiz."nodeId" = node.id
                  AND quiz."isDeleted" = false
              )
            ) ORDER BY node."orderIndex"
          )
          FROM "Node" node
          WHERE node."learningPathId" = lp.id
            AND node."isDeleted" = false
        ), '[]'::json)
      ) AS "learningPath"
    FROM "Enrollment" e
    JOIN "LearningPath" lp ON lp.id = e."learningPathId"
    LEFT JOIN "User" mentor ON mentor.id = lp."mentorId"
    LEFT JOIN "Subject" subject ON subject.id = lp."subjectId"
    WHERE e."userId" = ${userId}
      AND e."isDeleted" = false
      AND e.status::text <> 'DROPPED'
    ORDER BY e."enrolledAt" DESC
  `);

  return rows.map((row) => ({
    ...row,
    learningPath: {
      id: row.learningPath.id,
      title: row.learningPath.title,
      description: row.learningPath.description,
      thumbnail: row.learningPath.thumbnail,
      mentor: { name: row.learningPath.mentorName },
      subject: { name: row.learningPath.subjectName },
      nodes: row.learningPath.nodes || [],
    },
  }));
}

async function getRecommendations(userId) {
  const rows = await prisma.$queryRaw(Prisma.sql`
    SELECT
      lp.id,
      lp.title,
      lp.description,
      lp.thumbnail,
      mentor.name AS "mentorName",
      subject.name AS "subjectName",
      review_stats.rating,
      COALESCE(enrollment_stats.count, 0)::int AS "enrollmentCount",
      COALESCE(node_stats.count, 0)::int AS "nodeCount"
    FROM "LearningPath" lp
    LEFT JOIN "User" mentor ON mentor.id = lp."mentorId"
    LEFT JOIN "Subject" subject ON subject.id = lp."subjectId"
    LEFT JOIN LATERAL (
      SELECT AVG(review.rating)::float AS rating
      FROM "Review" review
      WHERE review."learningPathId" = lp.id
        AND review."isDeleted" = false
    ) review_stats ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(*) AS count
      FROM "Enrollment" enrollment
      WHERE enrollment."learningPathId" = lp.id
        AND enrollment."isDeleted" = false
    ) enrollment_stats ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(*) AS count
      FROM "Node" node
      WHERE node."learningPathId" = lp.id
        AND node."isDeleted" = false
    ) node_stats ON true
    WHERE lp."isDeleted" = false
      AND (
        lp.status::text IN ('APPROVED', 'PUBLISHED')
        OR lp."isPublic" = true
      )
      AND NOT EXISTS (
        SELECT 1
        FROM "Enrollment" own_enrollment
        WHERE own_enrollment."learningPathId" = lp.id
          AND own_enrollment."userId" = ${userId}
          AND own_enrollment."isDeleted" = false
      )
    ORDER BY "enrollmentCount" DESC, lp."createdAt" DESC
    LIMIT 4
  `);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    thumbnail: row.thumbnail,
    mentor: { name: row.mentorName },
    subject: { name: row.subjectName },
    reviews: row.rating === null ? [] : [{ rating: Number(row.rating) }],
    _count: {
      enrollments: Number(row.enrollmentCount),
      nodes: Number(row.nodeCount),
    },
  }));
}

function mapRecommendation(learningPath) {
  const ratings = learningPath.reviews.map((review) => review.rating);
  const rating = ratings.length
    ? Number(
        (
          ratings.reduce((total, value) => total + value, 0) / ratings.length
        ).toFixed(1)
      )
    : null;

  return {
    id: learningPath.id,
    slug: toRoadmapSlug(learningPath.title),
    title: learningPath.title,
    description: learningPath.description,
    thumbnail: learningPath.thumbnail,
    mentorName: learningPath.mentor?.name || 'Chưa cập nhật',
    subjectName: learningPath.subject?.name || 'Chưa phân loại',
    rating,
    enrollmentCount: learningPath._count.enrollments,
    nodeCount: learningPath._count.nodes,
  };
}

function buildActivities({
  enrollments,
  nodeProgresses,
  quizAttempts,
  tips,
  certificates,
}) {
  return [
    ...enrollments.map((item) => ({
      id: `enrollment-${item.id}`,
      type: 'ENROLLMENT',
      title: 'Đã đăng ký lộ trình',
      description: item.learningPath.title,
      occurredAt: item.enrolledAt,
    })),
    ...nodeProgresses.map((item) => ({
      id: `node-${item.id}`,
      type: 'NODE_COMPLETED',
      title: 'Đã hoàn thành nội dung học',
      description: `${item.node.title} · ${item.node.learningPath.title}`,
      occurredAt: item.completedAt,
    })),
    ...quizAttempts.map((item) => ({
      id: `quiz-${item.id}`,
      type: 'QUIZ_ATTEMPT',
      title:
        item.status === 'PASS'
          ? 'Đã vượt qua bài kiểm tra'
          : 'Đã làm bài kiểm tra',
      description: `${item.quiz.title} · ${item.score}%`,
      occurredAt: item.createdAt,
    })),
    ...tips.map((item) => ({
      id: `tip-${item.id}`,
      type: 'TIP_CONTRIBUTION',
      title: 'Đã đóng góp tip',
      description: item.title || item.node.title,
      occurredAt: item.createdAt,
    })),
    ...certificates.map((item) => ({
      id: `certificate-${item.id}`,
      type: 'CERTIFICATE',
      title: 'Đã nhận chứng chỉ',
      description: item.learningPath.title,
      occurredAt: item.issuedAt,
    })),
  ]
    .filter((item) => item.occurredAt)
    .sort(
      (left, right) => new Date(right.occurredAt) - new Date(left.occurredAt)
    )
    .slice(0, 6);
}

exports.getDashboard = async (userId) => {
  const [
    user,
    enrollmentRows,
    certificates,
    nodeProgresses,
    quizAttempts,
    passedQuizCount,
    tips,
    recommendations,
  ] = await Promise.all([
    prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
      select: { id: true, name: true, avatar: true, xp: true },
    }),
    getEnrollmentRows(userId),
    prisma.certificate.findMany({
      where: { userId, isDeleted: false },
      select: {
        id: true,
        issuedAt: true,
        verificationId: true,
        learningPath: { select: { title: true } },
      },
      orderBy: { issuedAt: 'desc' },
    }),
    prisma.nodeProgress.findMany({
      where: { userId, isDeleted: false, completed: true },
      select: {
        id: true,
        completedAt: true,
        node: {
          select: {
            title: true,
            learningPath: { select: { title: true } },
          },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: 6,
    }),
    prisma.quizAttempt.findMany({
      where: { userId, isDeleted: false },
      select: {
        id: true,
        score: true,
        status: true,
        createdAt: true,
        quiz: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.quizAttempt.count({
      where: { userId, isDeleted: false, status: 'PASS' },
    }),
    prisma.tip.findMany({
      where: { contributorId: userId, isDeleted: false },
      select: {
        id: true,
        title: true,
        createdAt: true,
        node: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    getRecommendations(userId),
  ]);

  if (!user) throw new ApiError(404, 'User not found');

  const enrollments = enrollmentRows.map(mapEnrollment);
  const activeEnrollments = enrollments.filter(
    (item) => item.status === 'ACTIVE'
  );
  const completedEnrollments = enrollments.filter(
    (item) => item.status === 'COMPLETED' || item.progressPercent >= 100
  );
  const averageProgress = enrollments.length
    ? enrollments.reduce((total, item) => total + item.progressPercent, 0) /
      enrollments.length
    : 0;
  const levelInfo = getLevelInfo(user.xp);

  return {
    user: {
      id: user.id,
      name: user.name || 'Học viên',
      avatarUrl: user.avatar,
      xp: user.xp,
      ...levelInfo,
    },
    stats: {
      activeEnrollmentCount: activeEnrollments.length,
      completedEnrollmentCount: completedEnrollments.length,
      averageProgress: Number(averageProgress.toFixed(1)),
      certificateCount: certificates.length,
      passedQuizCount,
    },
    continueLearning: activeEnrollments[0] || null,
    enrollments,
    recentActivities: buildActivities({
      enrollments: enrollmentRows,
      nodeProgresses,
      quizAttempts,
      tips,
      certificates,
    }),
    latestCertificate: certificates[0]
      ? {
          id: certificates[0].id,
          learningPathTitle: certificates[0].learningPath.title,
          issuedAt: certificates[0].issuedAt,
          verificationId: certificates[0].verificationId,
        }
      : null,
    recommendations: recommendations.map(mapRecommendation),
  };
};

exports.getLeaderboard = async (currentUserId, { period = 'week', limit = 10 } = {}) => {
  const normalizedPeriod = normalizePeriod(period);
  const normalizedLimit = Math.min(20, Math.max(1, Number(limit) || 10));
  const startAt = getPeriodStart(normalizedPeriod);

  const rows = await prisma.$queryRaw(Prisma.sql`
    SELECT
      u.id,
      COALESCE(u.name, 'Học viên') AS name,
      u.avatar,
      u.xp AS "totalXp",
      SUM(event."xpAmount")::int AS "xpEarned"
    FROM "UserXpEvent" event
    JOIN "User" u ON u.id = event."userId"
    LEFT JOIN "Role" r ON r.id = u."roleId"
    WHERE event."createdAt" >= ${startAt}
      AND u."isDeleted" = false
      AND r.name = 'MENTEE'
    GROUP BY u.id, u.name, u.avatar, u.xp
    ORDER BY "xpEarned" DESC, u."xp" DESC, u."createdAt" ASC
  `);

  const ranked = rows.map((row, index) => ({
    rank: index + 1,
    userId: row.id,
    name: row.name,
    avatarUrl: row.avatar,
    xpEarned: Number(row.xpEarned) || 0,
    totalXp: Number(row.totalXp) || 0,
    level: getLevelInfo(Number(row.totalXp) || 0).level,
    isCurrentUser: row.id === currentUserId,
  }));

  const top = ranked.slice(0, normalizedLimit);
  const currentUserRank =
    ranked.find((item) => item.userId === currentUserId) || null;

  return {
    period: normalizedPeriod,
    startAt,
    top,
    currentUserRank,
  };
};
