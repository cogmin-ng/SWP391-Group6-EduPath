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
  const {
    skip = 0,
    take = 20,
    search = '',
    subjectId,
    difficulty,
    excludeIds,
  } = filters;
  const { learningPathId, nodeId } = filters;

  const whereClause = {
    creatorId: mentorId,
    ...ACTIVE_FILTER,
  };

  if (excludeIds) {
    const ids = Array.isArray(excludeIds)
      ? excludeIds
      : typeof excludeIds === 'string'
      ? excludeIds.split(',').filter(Boolean)
      : [];
    if (ids.length > 0) {
      whereClause.id = {
        notIn: ids,
      };
    }
  }

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

  if (learningPathId) {
    whereClause.learningPathId = learningPathId;
  }

  if (nodeId) {
    whereClause.nodeId = nodeId;
  }

  const [questions, total] = await Promise.all([
    prisma.bankQuestion.findMany({
      where: whereClause,
      include: {
        subject: {
          select: { id: true, name: true },
        },
        learningPath: {
          select: { id: true, title: true },
        },
        node: {
          select: { id: true, title: true },
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
  const {
    question,
    explanation,
    difficulty,
    subjectId,
    learningPathId,
    nodeId,
    options,
  } = data;

  // Validate subject
  const subject = await prisma.subject.findFirst({
    where: { id: subjectId, ...ACTIVE_FILTER },
  });
  if (!subject) {
    throw new ApiError(404, msg.subjectNotFound);
  }

  let resolvedLearningPathId = learningPathId || null;
  let resolvedNodeId = nodeId || null;

  if (resolvedNodeId) {
    const node = await prisma.node.findFirst({
      where: { id: resolvedNodeId, isDeleted: false },
      select: {
        id: true,
        learningPathId: true,
        learningPath: { select: { mentorId: true } },
      },
    });

    if (!node) {
      throw new ApiError(404, 'Node not found');
    }
    if (node.learningPath.mentorId !== mentorId) {
      throw new ApiError(403, msg.permissionDenied);
    }

    resolvedLearningPathId = resolvedLearningPathId || node.learningPathId;
    resolvedNodeId = node.id;
  } else if (resolvedLearningPathId) {
    const learningPath = await prisma.learningPath.findFirst({
      where: { id: resolvedLearningPathId, mentorId, isDeleted: false },
      select: { id: true },
    });

    if (!learningPath) {
      throw new ApiError(404, 'Learning path not found');
    }
  }

  const createdQuestion = await prisma.$transaction(async (tx) => {
    return tx.bankQuestion.create({
      data: {
        question,
        explanation: explanation || null,
        difficulty,
        subjectId,
        learningPathId: resolvedLearningPathId,
        nodeId: resolvedNodeId,
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
        learningPath: {
          select: { id: true, title: true },
        },
        node: {
          select: { id: true, title: true },
        },
      },
    });
  });

  // If a node was provided, attempt to attach this bank question into the node's quiz (if a quiz exists)
  if (resolvedNodeId) {
    try {
      await prisma.$transaction(async (tx) => {
        const quiz = await tx.quiz.findFirst({
          where: { nodeId: resolvedNodeId, isDeleted: false },
          orderBy: { createdAt: 'desc' },
        });

        if (quiz) {
          // Avoid duplicate attachments
          const exists = await tx.quizQuestion.findFirst({
            where: { bankQuestionId: createdQuestion.id, quizId: quiz.id },
          });
          if (!exists) {
            await tx.quizQuestion.create({
              data: {
                quizId: quiz.id,
                question: createdQuestion.question,
                explanation: createdQuestion.explanation || null,
                bankQuestionId: createdQuestion.id,
                options: {
                  create: createdQuestion.options.map((opt) => ({
                    content: opt.content,
                    isCorrect: opt.isCorrect,
                  })),
                },
              },
            });
          }
        }
      });
    } catch (attachErr) {
      console.error('Failed to attach bank question to quiz:', attachErr);
    }
  }

  return createdQuestion;
};

/**
 * Edit a question in the bank.
 */
exports.updateBankQuestion = async (questionId, data, mentorId) => {
  const {
    question,
    explanation,
    difficulty,
    subjectId,
    learningPathId,
    nodeId,
    options,
  } = data;

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

  let resolvedLearningPathId =
    learningPathId !== undefined
      ? learningPathId || null
      : existing.learningPathId;
  let resolvedNodeId = nodeId !== undefined ? nodeId || null : existing.nodeId;

  if (resolvedNodeId) {
    const node = await prisma.node.findFirst({
      where: { id: resolvedNodeId, isDeleted: false },
      select: {
        id: true,
        learningPathId: true,
        learningPath: { select: { mentorId: true } },
      },
    });

    if (!node) {
      throw new ApiError(404, 'Node not found');
    }
    if (node.learningPath.mentorId !== mentorId) {
      throw new ApiError(403, msg.permissionDenied);
    }

    resolvedLearningPathId = resolvedLearningPathId || node.learningPathId;
    resolvedNodeId = node.id;
  } else if (
    resolvedLearningPathId !== undefined &&
    resolvedLearningPathId !== null
  ) {
    const learningPath = await prisma.learningPath.findFirst({
      where: { id: resolvedLearningPathId, mentorId, isDeleted: false },
      select: { id: true },
    });

    if (!learningPath) {
      throw new ApiError(404, 'Learning path not found');
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
        explanation:
          explanation !== undefined ? explanation : existing.explanation,
        difficulty: difficulty !== undefined ? difficulty : existing.difficulty,
        subjectId: subjectId !== undefined ? subjectId : existing.subjectId,
        learningPathId: resolvedLearningPathId,
        nodeId: resolvedNodeId,
        updatedAt: new Date(),
      },
      include: {
        options: {
          where: ACTIVE_FILTER,
        },
        subject: {
          select: { id: true, name: true },
        },
        learningPath: {
          select: { id: true, title: true },
        },
        node: {
          select: { id: true, title: true },
        },
      },
    });
  });

  // If the question is now attached to a node, try to attach it into that node's latest quiz
  if (resolvedNodeId) {
    try {
      await prisma.$transaction(async (tx) => {
        const quiz = await tx.quiz.findFirst({
          where: { nodeId: resolvedNodeId, isDeleted: false },
          orderBy: { createdAt: 'desc' },
        });
        if (quiz) {
          const exists = await tx.quizQuestion.findFirst({
            where: { bankQuestionId: updatedQuestion.id, quizId: quiz.id },
          });
          if (!exists) {
            await tx.quizQuestion.create({
              data: {
                quizId: quiz.id,
                question: updatedQuestion.question,
                explanation: updatedQuestion.explanation || null,
                bankQuestionId: updatedQuestion.id,
                options: {
                  create: updatedQuestion.options.map((opt) => ({
                    content: opt.content,
                    isCorrect: opt.isCorrect,
                  })),
                },
              },
            });
          }
        }
      });
    } catch (attachErr) {
      console.error(
        'Failed to attach updated bank question to quiz:',
        attachErr
      );
    }
  }

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
