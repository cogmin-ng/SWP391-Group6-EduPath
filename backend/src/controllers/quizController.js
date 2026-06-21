const quizService = require('../services/quizService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.createQuiz = asyncHandler(async (req, res) => {
  const mentorId = req.user.id;
  const quiz = await quizService.createQuiz(req.body, mentorId);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Quiz created successfully',
    data: quiz,
  });
});

exports.getQuizById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quiz = await quizService.getQuizById(id, req.user.id, req.user.roles);

  return sendSuccess(res, {
    message: 'Quiz retrieved successfully',
    data: quiz,
  });
});

exports.submitQuizAttempt = asyncHandler(async (req, res) => {
  const result = await quizService.submitQuizAttempt(
    req.params.id,
    req.body.answers,
    req.user.id,
    req.user.roles
  );

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Quiz submitted successfully',
    data: result,
  });
});

exports.getMyQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await quizService.getMyQuizAttempts(
    req.params.id,
    req.user.id,
    req.user.roles
  );

  return sendSuccess(res, {
    message: 'Quiz attempts retrieved successfully',
    data: attempts,
  });
});

exports.getQuizzesByNode = asyncHandler(async (req, res) => {
  const { nodeId } = req.params;
  const quizzes = await quizService.getQuizzesByNode(nodeId);

  return sendSuccess(res, {
    message: 'Quizzes retrieved successfully',
    data: quizzes,
  });
});

exports.updateQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const mentorId = req.user.id;
  const quiz = await quizService.updateQuiz(id, req.body, mentorId);

  return sendSuccess(res, {
    message: 'Quiz updated successfully',
    data: quiz,
  });
});

exports.deleteQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const mentorId = req.user.id;
  await quizService.deleteQuiz(id, mentorId);

  return sendSuccess(res, {
    message: 'Quiz deleted successfully',
  });
});
