const Router = require('express').Router;
const personalNoteController = require('../controllers/personalNoteController');
const { requireAuth, requireRole } = require('../middleware/auth');
const validateSchema = require('../middleware/validateSchema');
const {
  listNotesQuerySchema,
  saveNoteSchema,
} = require('../validators/personalNote.validator');

const router = Router();

router.use(requireAuth, requireRole(['MENTEE']));

/**
 * @swagger
 * /api/personal-notes:
 *   get:
 *     tags: [Personal Learning Notes]
 *     summary: Lấy danh sách ghi chú cá nhân của Mentee
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema: { type: integer, minimum: 0, default: 0 }
 *       - in: query
 *         name: take
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 50 }
 *     responses:
 *       200: { description: Danh sách ghi chú thuộc các enrollment hợp lệ }
 */
router.get(
  '/',
  validateSchema(listNotesQuerySchema, 'query'),
  personalNoteController.listNotes
);

/**
 * @swagger
 * /api/personal-notes/nodes/{nodeId}:
 *   get:
 *     tags: [Personal Learning Notes]
 *     summary: Lấy ghi chú cá nhân của Mentee trong một Node
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Ghi chú hiện tại hoặc null }
 *       403: { description: Mentee chưa tham gia lộ trình }
 *       404: { description: Không tìm thấy Node }
 */
router.get('/nodes/:nodeId', personalNoteController.getNote);

/**
 * @swagger
 * /api/personal-notes/nodes/{nodeId}:
 *   put:
 *     tags: [Personal Learning Notes]
 *     summary: Tạo mới hoặc cập nhật ghi chú cá nhân trong Node
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string, minLength: 1, maxLength: 10000 }
 *     responses:
 *       200: { description: Ghi chú đã được lưu }
 *       400: { description: Nội dung không hợp lệ }
 *       403: { description: Mentee chưa tham gia lộ trình }
 */
router.put(
  '/nodes/:nodeId',
  validateSchema(saveNoteSchema),
  personalNoteController.saveNote
);

/**
 * @swagger
 * /api/personal-notes/nodes/{nodeId}:
 *   delete:
 *     tags: [Personal Learning Notes]
 *     summary: Xóa mềm ghi chú cá nhân trong Node
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Ghi chú đã được xóa }
 *       404: { description: Không tìm thấy ghi chú đang hoạt động }
 */
router.delete('/nodes/:nodeId', personalNoteController.deleteNote);

/**
 * @swagger
 * /api/personal-notes/roadmaps/{roadmapId}/export:
 *   get:
 *     tags: [Personal Learning Notes]
 *     summary: Xuất toàn bộ ghi chú của Mentee trong lộ trình thành PDF
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: File PDF ghi chú
 *         content:
 *           application/pdf:
 *             schema: { type: string, format: binary }
 *       403: { description: Mentee chưa tham gia lộ trình }
 *       404: { description: Không có ghi chú để xuất }
 */
router.get(
  '/roadmaps/:roadmapId/export',
  personalNoteController.exportRoadmapNotes
);

module.exports = router;
