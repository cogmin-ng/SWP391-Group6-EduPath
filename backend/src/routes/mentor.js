const Router = require('express').Router;
const userController = require('../controllers/userController');
const mentorLearnerController = require('../controllers/mentorLearnerController');
const { requireAuth, requireRole } = require('../middleware/auth');
const validateSchema = require('../middleware/validateSchema');
const {
  listLearnersQuerySchema,
  sendReminderSchema,
} = require('../validators/mentorLearner.validator');

const router = Router();

/**
 * @swagger
 * /api/mentors/hot:
 *   get:
 *     tags:
 *       - Mentor
 *     summary: Get hot/trending mentors sorted by learners, rating, and learning paths
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 9
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Paginated list of hot mentors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     mentors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           fullName:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                             nullable: true
 *                           bio:
 *                             type: string
 *                             nullable: true
 *                           averageRating:
 *                             type: number
 *                           totalLearners:
 *                             type: integer
 *                           totalLearningPaths:
 *                             type: integer
 *                           totalReviews:
 *                             type: integer
 *                           subjects:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       400:
 *         description: Invalid pagination parameters
 */
router.get('/hot', userController.getHotMentors);

router.use(requireAuth, requireRole(['MENTOR']));

/**
 * @swagger
 * /api/mentors/learners:
 *   get:
 *     tags: [Mentor]
 *     summary: List enrollments in learning paths owned by the current mentor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 50, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, COMPLETED] }
 *     responses:
 *       200:
 *         description: Paginated mentor learner enrollments and global stats
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Mentor role required
 */
router.get(
  '/learners',
  validateSchema(listLearnersQuerySchema, 'query'),
  mentorLearnerController.getLearners
);

/**
 * @swagger
 * /api/mentors/learners/{enrollmentId}/reminders:
 *   post:
 *     tags: [Mentor]
 *     summary: Send an in-app learning reminder for an owned enrollment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title: { type: string, minLength: 1, maxLength: 120 }
 *               content: { type: string, minLength: 1, maxLength: 1000 }
 *     responses:
 *       201:
 *         description: Reminder created
 *       404:
 *         description: Enrollment not found or not owned by mentor
 */
router.post(
  '/learners/:enrollmentId/reminders',
  validateSchema(sendReminderSchema),
  mentorLearnerController.sendReminder
);

module.exports = router;
