const Router = require('express').Router;
const roadmapController = require('../controllers/roadmapController');
const { requireAuth, requireRole, optionalAuth } = require('../middleware/auth');
const validateSchema = require('../middleware/validateSchema');
const {
  createRoadmapSchema,
  updateRoadmapSchema,
  reviewRoadmapSchema,
} = require('../validators/roadmap.validator');

const router = Router();

/**
 * @swagger
 * /api/roadmaps:
 *   post:
 *     tags:
 *       - Roadmap
 *     summary: Tạo lộ trình học tập mới (Mentor only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "React Basics for Beginners"
 *               description:
 *                 type: string
 *                 example: "Lộ trình học ReactJS từ cơ bản đến nâng cao"
 *               subjectId:
 *                 type: string
 *                 example: "clxyz123abc"
 *               thumbnail:
 *                 type: string
 *                 example: "https://cloudinary.com/image.jpg"
 *               xpReward:
 *                 type: integer
 *                 example: 100
 *               nodes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     orderIndex:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Roadmap created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  requireAuth,
  requireRole(['MENTOR']),
  validateSchema(createRoadmapSchema),
  roadmapController.createRoadmap
);

/**
 * @swagger
 * /api/roadmaps/mentor:
 *   get:
 *     tags:
 *       - Roadmap
 *     summary: Lấy danh sách lộ trình của Mentor đang đăng nhập
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: skip
 *         in: query
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: take
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of mentor roadmaps
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/mentor',
  requireAuth,
  requireRole(['MENTOR']),
  roadmapController.getMentorRoadmaps
);

/**
 * @swagger
 * /api/roadmaps/mentor/stats:
 *   get:
 *     tags:
 *       - Roadmap
 *     summary: Lấy thống kê dashboard cho Mentor
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
router.get(
  '/mentor/stats',
  requireAuth,
  requireRole(['MENTOR']),
  roadmapController.getMentorDashboardStats
);

// --- Admin Section (Must be before parametric routes) ---

/**
 * @swagger
 * /api/roadmaps/pending:
 *   get:
 *     tags:
 *       - Roadmap
 *     summary: Lấy danh sách lộ trình đang chờ phê duyệt (Admin only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending roadmaps
 */
router.get(
  '/pending',
  requireAuth,
  requireRole(['ADMIN']),
  roadmapController.getPendingRoadmaps
);

/**
 * @swagger
 * /api/roadmaps/stats:
 *   get:
 *     tags:
 *       - Roadmap
 *     summary: Lấy thống kê trạng thái lộ trình (Admin only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Roadmap status statistics
 */
router.get(
  '/stats',
  requireAuth,
  requireRole(['ADMIN']),
  roadmapController.getRoadmapStats
);

// --- Parametric Routes ---

router.get('/slug/:slug', optionalAuth, roadmapController.getRoadmapBySlug);

/**
 * @swagger
 * /api/roadmaps/{id}:
 *   get:
 *     tags:
 *       - Roadmap
 *     summary: Lấy chi tiết lộ trình theo ID
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
 *         description: Roadmap detail
 *       403:
 *         description: Forbidden (DRAFT/PENDING visible to owner/admin only)
 *       404:
 *         description: Roadmap not found
 */
router.get('/:id', requireAuth, roadmapController.getRoadmapById);

/**
 * @swagger
 * /api/roadmaps/{id}:
 *   put:
 *     tags:
 *       - Roadmap
 *     summary: Cập nhật lộ trình (Mentor owner only)
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               xpReward:
 *                 type: integer
 *               nodes:
 *                 type: array
 *     responses:
 *       200:
 *         description: Roadmap updated successfully
 *       400:
 *         description: Validation failed or cannot edit PUBLISHED roadmap
 *       403:
 *         description: Forbidden - not the roadmap owner
 *       404:
 *         description: Roadmap not found
 */
router.put(
  '/:id',
  requireAuth,
  requireRole(['MENTOR']),
  validateSchema(updateRoadmapSchema),
  roadmapController.updateRoadmap
);

/**
 * @swagger
 * /api/roadmaps/{id}:
 *   delete:
 *     tags:
 *       - Roadmap
 *     summary: Xóa lộ trình (soft delete, Mentor owner only)
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
 *         description: Roadmap deleted successfully
 *       400:
 *         description: Cannot delete a PUBLISHED roadmap
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Roadmap not found
 */
router.delete(
  '/:id',
  requireAuth,
  requireRole(['MENTOR']),
  roadmapController.deleteRoadmap
);

/**
 * @swagger
 * /api/roadmaps/{id}/submit:
 *   post:
 *     tags:
 *       - Roadmap
 *     summary: Gửi lộ trình DRAFT để phê duyệt (chuyển sang PENDING)
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
 *         description: Roadmap submitted for review
 *       400:
 *         description: Only DRAFT roadmaps can be submitted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Roadmap not found
 */
router.post(
  '/:id/submit',
  requireAuth,
  requireRole(['MENTOR']),
  roadmapController.submitRoadmap
);

// Admin review remains below as it's a post route with :id, but doesn't conflict with GET /stats etc.

/**
 * @swagger
 * /api/roadmaps/{id}/review:
 *   post:
 *     tags:
 *       - Roadmap
 *     summary: Phê duyệt hoặc Từ chối lộ trình (Admin only)
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
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED, PUBLISHED]
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: Roadmap reviewed successfully
 */
router.post(
  '/:id/review',
  requireAuth,
  requireRole(['ADMIN']),
  validateSchema(reviewRoadmapSchema),
  roadmapController.reviewRoadmap
);

module.exports = router;
