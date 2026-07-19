const questionBankService = require('../services/questionBankService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

/**
 * GET /api/question-bank
 * Retrieve mentor's question bank with search, filters, pagination.
 */
exports.getQuestionBank = asyncHandler(async (req, res) => {
  const filters = {
    skip: parseInt(req.query.skip) || 0,
    take: parseInt(req.query.take) || 20,
    search: req.query.search || '',
    subjectId: req.query.subjectId || null,
    difficulty: req.query.difficulty || null,
  };

  const result = await questionBankService.getQuestionBank(req.user.id, filters);

  return sendSuccess(res, {
    message: 'Question bank retrieved successfully',
    data: result,
  });
});

/**
 * POST /api/question-bank
 * Create a new question in the bank.
 */
exports.createBankQuestion = asyncHandler(async (req, res) => {
  const question = await questionBankService.createBankQuestion(req.body, req.user.id);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Question created in bank successfully',
    data: question,
  });
});

/**
 * PUT /api/question-bank/:id
 * Update a question details or options.
 */
exports.updateBankQuestion = asyncHandler(async (req, res) => {
  const question = await questionBankService.updateBankQuestion(req.params.id, req.body, req.user.id);

  return sendSuccess(res, {
    message: 'Question updated successfully',
    data: question,
  });
});

/**
 * DELETE /api/question-bank/:id
 * Soft-delete a question from bank.
 */
exports.deleteBankQuestion = asyncHandler(async (req, res) => {
  await questionBankService.deleteBankQuestion(req.params.id, req.user.id);

  return sendSuccess(res, {
    message: 'Question deleted from bank successfully',
  });
});
