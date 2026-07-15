const Router = require('express').Router;
const nodeCommentController = require('../controllers/nodeCommentController');
const { requireAuth } = require('../middleware/auth');
const validateSchema = require('../middleware/validateSchema');
const {
  createCommentSchema,
  updateCommentSchema,
  createReplySchema,
} = require('../validators/nodeComment.validator');

const router = Router();

/**
 * @swagger
 * /api/node-comments/node/{nodeId}:
 *   get:
 *     tags:
 *       - NodeComment
 *     summary: Lấy danh sách bình luận theo node
 *     description: Trả về danh sách comments gốc kèm replies và thông tin user (avatar, name, role). Sắp xếp mới nhất trước.
 *     parameters:
 *       - name: nodeId
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
 *         description: Danh sách comments với replies
 */
router.get('/node/:nodeId', nodeCommentController.getComments);

/**
 * @swagger
 * /api/node-comments/node/{nodeId}:
 *   post:
 *     tags:
 *       - NodeComment
 *     summary: Tạo bình luận mới cho node
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: nodeId
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
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Phần này rất hay, cảm ơn mentor!"
 *     responses:
 *       201:
 *         description: Comment created successfully
 */
router.post(
  '/node/:nodeId',
  requireAuth,
  validateSchema(createCommentSchema),
  nodeCommentController.createComment
);

/**
 * @swagger
 * /api/node-comments/{commentId}/reply:
 *   post:
 *     tags:
 *       - NodeComment
 *     summary: Trả lời một bình luận
 *     description: Tạo reply cho comment gốc. Chỉ hỗ trợ 1 cấp reply (không reply reply).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: commentId
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
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Cảm ơn bạn, mình cũng thấy rất hữu ích!"
 *     responses:
 *       201:
 *         description: Reply created successfully
 */
router.post(
  '/:commentId/reply',
  requireAuth,
  validateSchema(createReplySchema),
  nodeCommentController.createReply
);

/**
 * @swagger
 * /api/node-comments/{commentId}:
 *   put:
 *     tags:
 *       - NodeComment
 *     summary: Chỉnh sửa bình luận hoặc reply của mình
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: commentId
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
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 */
router.put(
  '/:commentId',
  requireAuth,
  validateSchema(updateCommentSchema),
  nodeCommentController.updateComment
);

/**
 * @swagger
 * /api/node-comments/{commentId}:
 *   delete:
 *     tags:
 *       - NodeComment
 *     summary: Xóa bình luận hoặc reply của mình (soft delete)
 *     description: Soft delete — isDeleted = true. Các replies của comment vẫn được giữ.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete(
  '/:commentId',
  requireAuth,
  nodeCommentController.deleteComment
);

module.exports = router;
