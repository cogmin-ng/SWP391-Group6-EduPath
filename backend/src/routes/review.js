const Router = require('express').Router;
const reviewController = require('../controllers/reviewController');
const { requireAuth, requireRole } = require('../middleware/auth');
const validateSchema = require('../middleware/validateSchema');
const {
  createReviewSchema,
  updateReviewSchema,
  mentorReplySchema,
} = require('../validators/review.validator');

const router = Router();

/**
 * @swagger
 * /api/reviews/learning-path/{learningPathId}:
 *   get:
 *     tags:
 *       - Review
 *     summary: Lấy danh sách reviews theo learning path
 *     parameters:
 *       - name: learningPathId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: skip
 *         in: query
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get('/learning-path/:learningPathId', reviewController.getReviews);

/**
 * @swagger
 * /api/reviews/learning-path/{learningPathId}/my:
 *   get:
 *     tags:
 *       - Review
 *     summary: Lấy review của người dùng hiện tại (Mentee)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: learningPathId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Current user review details
 */
router.get(
  '/learning-path/:learningPathId/my',
  requireAuth,
  reviewController.getMyReview
);

/**
 * @swagger
 * /api/reviews/learning-path/{learningPathId}:
 *   post:
 *     tags:
 *       - Review
 *     summary: Đánh giá learning path (Mentee)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: learningPathId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Very good"
 *     responses:
 *       201:
 *         description: Review submitted successfully
 */
router.post(
  '/learning-path/:learningPathId',
  requireAuth,
  validateSchema(createReviewSchema),
  reviewController.createReview
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     tags:
 *       - Review
 *     summary: Cập nhật đánh giá của mình
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 */
router.put(
  '/:id',
  requireAuth,
  validateSchema(updateReviewSchema),
  reviewController.updateReview
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     tags:
 *       - Review
 *     summary: Xóa đánh giá của mình
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */
router.delete('/:id', requireAuth, reviewController.deleteReview);

// --- MENTOR REPLY ---

/**
 * @swagger
 * /api/reviews/{id}/reply:
 *   post:
 *     tags:
 *       - Review
 *     summary: Mentor trả lời đánh giá (Mentor owner only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mentorReply:
 *                 type: string
 *                 example: "Cảm ơn bạn đã đánh giá"
 *     responses:
 *       201:
 *         description: Reply submitted successfully
 */
router.post(
  '/:id/reply',
  requireAuth,
  requireRole(['MENTOR']),
  validateSchema(mentorReplySchema),
  reviewController.createMentorReply
);

/**
 * @swagger
 * /api/reviews/{id}/reply:
 *   put:
 *     tags:
 *       - Review
 *     summary: Mentor sửa câu trả lời (Mentor owner only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mentorReply:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply updated successfully
 */
router.put(
  '/:id/reply',
  requireAuth,
  requireRole(['MENTOR']),
  validateSchema(mentorReplySchema),
  reviewController.updateMentorReply
);

/**
 * @swagger
 * /api/reviews/{id}/reply:
 *   delete:
 *     tags:
 *       - Review
 *     summary: Mentor xóa câu trả lời (Mentor owner only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reply deleted successfully
 */
router.delete(
  '/:id/reply',
  requireAuth,
  requireRole(['MENTOR']),
  reviewController.deleteMentorReply
);

module.exports = router;
