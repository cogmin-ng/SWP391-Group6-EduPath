const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');
const enrollmentActivityService = require('./enrollmentActivityService');

const ACTIVE_QUIZ_FILTER = { isDeleted: false };

const quizMessages = {
  notFound: 'Quiz not found',
  nodeNotFound: 'Node not found',
  invalidId: 'Invalid quiz id',
  permissionDenied: 'You do not have permission to perform this action',
};

async function assertQuizReadAccess(quizId, userId, roles = []) {
  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, ...ACTIVE_QUIZ_FILTER },
    include: {
      node: {
        include: {
          learningPath: true,
        },
      },
      questions: {
        where: { isDeleted: false },
        include: {
          options: {
            where: { isDeleted: false },
          },
        },
      },
    },
  });

  if (!quiz) {
    throw new ApiError(404, quizMessages.notFound);
  }

  const isOwner = quiz.node.learningPath.mentorId === userId;
  const isAdmin = roles.includes('ADMIN');

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      learningPathId: quiz.node.learningPathId,
      isDeleted: false,
      status: { not: 'DROPPED' },
    },
  });

  if (!isOwner && !isAdmin && !enrollment) {
    throw new ApiError(403, quizMessages.permissionDenied);
  }

  return quiz;
}

/**
 * Create a quiz with nested questions and options in a single transaction.
 */
exports.createQuiz = async (data, mentorId) => {
  const { nodeId, title, description, passingScore, xpReward, questions } =
    data;

  // Verify node exists and mentor owns the roadmap
  const node = await prisma.node.findFirst({
    where: { id: nodeId, isDeleted: false },
    include: { learningPath: true },
  });

  if (!node) {
    throw new ApiError(404, quizMessages.nodeNotFound);
  }

  if (node.learningPath.mentorId !== mentorId) {
    throw new ApiError(403, quizMessages.permissionDenied);
  }

  // Create quiz with nested questions and options in a transaction
  const quiz = await prisma.quiz.create({
    data: {
      nodeId,
      title,
      description: description || null,
      passingScore,
      xpReward: xpReward ?? 50,
      questions: {
        create: questions.map((q) => ({
          question: q.question,
          explanation: q.explanation || null,
          bankQuestionId: q.bankQuestionId || null,
          options: {
            create: q.options.map((opt) => ({
              content: opt.content,
              isCorrect: opt.isCorrect,
            })),
          },
        })),
      },
    },
    include: {
      questions: {
        where: { isDeleted: false },
        include: {
          options: {
            where: { isDeleted: false },
          },
        },
      },
    },
  });

  return quiz;
};

/**
 * Get a quiz by ID with its questions and options.
 */
exports.getQuizById = async (quizId, userId, roles = []) => {
  if (!quizId || typeof quizId !== 'string') {
    throw new ApiError(400, quizMessages.invalidId);
  }

  return assertQuizReadAccess(quizId, userId, roles);
};

/**
 * Get all quizzes for a specific node.
 */
exports.getQuizzesByNode = async (nodeId) => {
  const quizzes = await prisma.quiz.findMany({
    where: { nodeId, ...ACTIVE_QUIZ_FILTER },
    include: {
      questions: {
        where: { isDeleted: false },
        include: {
          options: {
            where: { isDeleted: false },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return quizzes;
};

exports.submitQuizAttempt = async (quizId, answers, userId, roles = []) => {
  const quiz = await assertQuizReadAccess(quizId, userId, roles);

  const submittedAnswers =
    answers && typeof answers === 'object' ? answers : {};
  const totalQuestions = quiz.questions.length;
  const correctCount = quiz.questions.filter((question) => {
    const correctOption = question.options.find((option) => option.isCorrect);
    return correctOption && submittedAnswers[question.id] === correctOption.id;
  }).length;
  const score =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const previousAttempts = await prisma.quizAttempt.count({
    where: {
      quizId,
      userId,
      isDeleted: false,
    },
  });

  const attempt = await prisma.$transaction(async (tx) => {
    const createdAttempt = await tx.quizAttempt.create({
      data: {
        quizId,
        userId,
        score,
        status: score >= quiz.passingScore ? 'PASS' : 'FAIL',
        attemptCount: previousAttempts + 1,
      },
    });

    await enrollmentActivityService.touch(userId, quiz.node.learningPathId, tx);

    return createdAttempt;
  });

  // Run automatic badge checks
  try {
    const badgeService = require('./badgeService');
    await badgeService.runBadgeChecks(userId);
  } catch (badgeError) {
    console.error('Error running badge checks on quiz submission:', badgeError);
  }

  return {
    attempt,
    review: {
      totalQuestions,
      correctCount,
      score,
      passed: attempt.status === 'PASS',
      passingScore: quiz.passingScore,
    },
  };
};

exports.getMyQuizAttempts = async (quizId, userId, roles = []) => {
  await assertQuizReadAccess(quizId, userId, roles);

  return prisma.quizAttempt.findMany({
    where: {
      quizId,
      userId,
      isDeleted: false,
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Update a quiz: replace all questions and options.
 * Strategy: update quiz info, delete old questions/options, create new ones.
 */
exports.updateQuiz = async (quizId, data, mentorId) => {
  const { title, description, passingScore, xpReward, questions } = data;

  // Verify quiz exists
  const existingQuiz = await prisma.quiz.findFirst({
    where: { id: quizId, ...ACTIVE_QUIZ_FILTER },
    include: {
      node: {
        include: { learningPath: true },
      },
    },
  });

  if (!existingQuiz) {
    throw new ApiError(404, quizMessages.notFound);
  }

  if (existingQuiz.node.learningPath.mentorId !== mentorId) {
    throw new ApiError(403, quizMessages.permissionDenied);
  }

  // Use transaction: delete old questions/options, then update quiz with new data
  const updatedQuiz = await prisma.$transaction(async (tx) => {
    // Delete old options (cascade through questions)
    await tx.quizOption.deleteMany({
      where: {
        question: {
          quizId,
        },
      },
    });

    // Delete old questions
    await tx.quizQuestion.deleteMany({
      where: { quizId },
    });

    // Update quiz and create new questions/options
    return tx.quiz.update({
      where: { id: quizId },
      data: {
        title,
        description: description || null,
        passingScore,
        xpReward: xpReward ?? 50,
        questions: {
          create: questions.map((q) => ({
            question: q.question,
            explanation: q.explanation || null,
            bankQuestionId: q.bankQuestionId || null,
            options: {
              create: q.options.map((opt) => ({
                content: opt.content,
                isCorrect: opt.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          where: { isDeleted: false },
          include: {
            options: {
              where: { isDeleted: false },
            },
          },
        },
      },
    });
  });

  return updatedQuiz;
};

/**
 * Soft delete a quiz.
 */
exports.deleteQuiz = async (quizId, mentorId) => {
  if (!quizId || typeof quizId !== 'string') {
    throw new ApiError(400, quizMessages.invalidId);
  }

  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, ...ACTIVE_QUIZ_FILTER },
    include: {
      node: {
        include: { learningPath: true },
      },
    },
  });

  if (!quiz) {
    throw new ApiError(404, quizMessages.notFound);
  }

  if (quiz.node.learningPath.mentorId !== mentorId) {
    throw new ApiError(403, quizMessages.permissionDenied);
  }

  const deletedQuiz = await prisma.quiz.update({
    where: { id: quizId },
    data: { isDeleted: true },
  });

  return deletedQuiz;
};
