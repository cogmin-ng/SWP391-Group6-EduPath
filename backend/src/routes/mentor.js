const Router = require('express').Router;
const userController = require('../controllers/userController');

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

module.exports = router;
