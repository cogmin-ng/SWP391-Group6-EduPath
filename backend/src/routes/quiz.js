const Router = require('express').Router;
const quizController = require('../controllers/quizController');
const { requireAuth, requireRole } = require('../middleware/auth');
const validateSchema = require('../middleware/validateSchema');
const {
  createQuizSchema,
  updateQuizSchema,
} = require('../validators/quiz.validator');

const router = Router();

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     tags:
 *       - Quiz
 *     summary: Create a new quiz for a node (Mentor only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizCreateRequest'
 *           example:
 *             nodeId: "clxyz123abc"
 *             title: "Agile Basics Quiz"
 *             description: "Test your knowledge of Agile fundamentals"
 *             passingScore: 80
 *             xpReward: 50
 *             questions:
 *               - question: "What does Agile prioritize?"
 *                 explanation: "Agile values individuals and interactions over processes and tools."
 *                 options:
 *                   - content: "Individuals and interactions"
 *                     isCorrect: true
 *                   - content: "Processes and tools"
 *                     isCorrect: false
 *                   - content: "Comprehensive documentation"
 *                     isCorrect: false
 *                   - content: "Contract negotiation"
 *                     isCorrect: false
 *               - question: "What is Scrum?"
 *                 explanation: "Scrum is a framework within Agile methodology."
 *                 options:
 *                   - content: "A programming language"
 *                     isCorrect: false
 *                   - content: "An Agile framework"
 *                     isCorrect: true
 *                   - content: "A database system"
 *                     isCorrect: false
 *                   - content: "A testing tool"
 *                     isCorrect: false
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Quiz created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/QuizResponse'
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the roadmap owner
 *       404:
 *         description: Node not found
 */
router.post(
  '/',
  requireAuth,
  requireRole(['MENTOR']),
  validateSchema(createQuizSchema),
  quizController.createQuiz
);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     tags:
 *       - Quiz
 *     summary: Get a quiz by ID with questions and options
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Quiz retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/QuizResponse'
 *       400:
 *         description: Invalid quiz ID
 *       404:
 *         description: Quiz not found
 */
router.get('/:id', requireAuth, quizController.getQuizById);

router.post('/:id/attempts', requireAuth, quizController.submitQuizAttempt);

router.get('/:id/attempts/me', requireAuth, quizController.getMyQuizAttempts);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   put:
 *     tags:
 *       - Quiz
 *     summary: Update a quiz (Mentor only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizUpdateRequest'
 *           example:
 *             title: "Updated Agile Quiz"
 *             description: "Updated description"
 *             passingScore: 70
 *             xpReward: 100
 *             questions:
 *               - question: "What is the Agile Manifesto?"
 *                 explanation: "The Agile Manifesto outlines core values."
 *                 options:
 *                   - content: "A set of values and principles"
 *                     isCorrect: true
 *                   - content: "A programming language"
 *                     isCorrect: false
 *                   - content: "A project management tool"
 *                     isCorrect: false
 *                   - content: "A software license"
 *                     isCorrect: false
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Quiz updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/QuizResponse'
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the roadmap owner
 *       404:
 *         description: Quiz not found
 */
router.put(
  '/:id',
  requireAuth,
  requireRole(['MENTOR']),
  validateSchema(updateQuizSchema),
  quizController.updateQuiz
);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   delete:
 *     tags:
 *       - Quiz
 *     summary: Delete a quiz (soft delete, Mentor only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Quiz deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the roadmap owner
 *       404:
 *         description: Quiz not found
 */
router.delete(
  '/:id',
  requireAuth,
  requireRole(['MENTOR']),
  quizController.deleteQuiz
);

/**
 * @swagger
 * /api/nodes/{nodeId}/quizzes:
 *   get:
 *     tags:
 *       - Quiz
 *     summary: Get all quizzes for a specific node
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: nodeId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Node ID
 *     responses:
 *       200:
 *         description: List of quizzes for the node
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Quizzes retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuizResponse'
 *       401:
 *         description: Unauthorized
 */
// NOTE: This route is registered separately in routes/index.js under /nodes/:nodeId/quizzes

module.exports = router;
