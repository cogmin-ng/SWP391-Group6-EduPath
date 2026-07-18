const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');

const ACTIVE_FILTER = { isDeleted: false };

const msg = {
  notFound: 'Question not found',
  permissionDenied: 'You do not have permission to perform this action',
  subjectNotFound: 'Subject not found',
};

/**
 * Get paginated questions from the mentor's bank.
 */
exports.getQuestionBank = async (mentorId, filters = {}) => {
  const { skip = 0, take = 20, search = '', subjectId, difficulty } = filters;

  const whereClause = {
    creatorId: mentorId,
    ...ACTIVE_FILTER,
  };

  if (search.trim()) {
    whereClause.question = {
      contains: search.trim(),
      mode: 'insensitive',
    };
  }

  if (subjectId) {
    whereClause.subjectId = subjectId;
  }

  if (difficulty) {
    whereClause.difficulty = difficulty;
  }

  const [questions, total] = await Promise.all([
    prisma.bankQuestion.findMany({
      where: whereClause,
      include: {
        subject: {
          select: { id: true, name: true },
        },
        options: {
          where: ACTIVE_FILTER,
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(take),
    }),
    prisma.bankQuestion.count({
      where: whereClause,
    }),
  ]);

  return { questions, total };
};

/**
 * Add a new question to the bank.
 */
exports.createBankQuestion = async (data, mentorId) => {
  const { question, explanation, difficulty, subjectId, options } = data;

  // Validate subject
  const subject = await prisma.subject.findFirst({
    where: { id: subjectId, ...ACTIVE_FILTER },
  });
  if (!subject) {
    throw new ApiError(404, msg.subjectNotFound);
  }

  const createdQuestion = await prisma.$transaction(async (tx) => {
    return tx.bankQuestion.create({
      data: {
        question,
        explanation: explanation || null,
        difficulty,
        subjectId,
        creatorId: mentorId,
        options: {
          create: options.map((opt) => ({
            content: opt.content,
            isCorrect: opt.isCorrect,
          })),
        },
      },
      include: {
        options: {
          where: ACTIVE_FILTER,
        },
        subject: {
          select: { id: true, name: true },
        },
      },
    });
  });

  return createdQuestion;
};

/**
 * Edit a question in the bank.
 */
exports.updateBankQuestion = async (questionId, data, mentorId) => {
  const { question, explanation, difficulty, subjectId, options } = data;

  // Verify ownership
  const existing = await prisma.bankQuestion.findFirst({
    where: { id: questionId, ...ACTIVE_FILTER },
  });
  if (!existing) {
    throw new ApiError(404, msg.notFound);
  }
  if (existing.creatorId !== mentorId) {
    throw new ApiError(403, msg.permissionDenied);
  }

  // Validate subject if provided
  if (subjectId) {
    const subject = await prisma.subject.findFirst({
      where: { id: subjectId, ...ACTIVE_FILTER },
    });
    if (!subject) {
      throw new ApiError(404, msg.subjectNotFound);
    }
  }

  const updatedQuestion = await prisma.$transaction(async (tx) => {
    // Sync options if provided
    if (options && Array.isArray(options)) {
      // Delete old options
      await tx.bankQuestionOption.deleteMany({
        where: { questionId },
      });

      // Create new ones
      await tx.bankQuestionOption.createMany({
        data: options.map((opt) => ({
          questionId,
          content: opt.content,
          isCorrect: opt.isCorrect,
        })),
      });
    }

    // Update bank question fields
    return tx.bankQuestion.update({
      where: { id: questionId },
      data: {
        question: question !== undefined ? question : existing.question,
        explanation: explanation !== undefined ? explanation : existing.explanation,
        difficulty: difficulty !== undefined ? difficulty : existing.difficulty,
        subjectId: subjectId !== undefined ? subjectId : existing.subjectId,
        updatedAt: new Date(),
      },
      include: {
        options: {
          where: ACTIVE_FILTER,
        },
        subject: {
          select: { id: true, name: true },
        },
      },
    });
  });

  return updatedQuestion;
};

/**
 * Delete (soft delete) a question.
 */
exports.deleteBankQuestion = async (questionId, mentorId) => {
  // Verify ownership
  const existing = await prisma.bankQuestion.findFirst({
    where: { id: questionId, ...ACTIVE_FILTER },
  });
  if (!existing) {
    throw new ApiError(404, msg.notFound);
  }
  if (existing.creatorId !== mentorId) {
    throw new ApiError(403, msg.permissionDenied);
  }

  await prisma.bankQuestion.update({
    where: { id: questionId },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });
};
