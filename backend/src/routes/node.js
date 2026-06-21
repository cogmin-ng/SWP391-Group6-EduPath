const Router = require('express').Router;
const nodeController = require('../controllers/nodeController');
const { requireAuth, requireRole } = require('../middleware/auth');
const validateSchema = require('../middleware/validateSchema');
const { syncNodeDetailsSchema } = require('../validators/node.validator');

const router = Router();

/**
 * @swagger
 * /api/nodes/{id}:
 *   get:
 *     tags:
 *       - Node
 *     summary: Lấy chi tiết một Node (bao gồm checklists, materials, quizzes, tips)
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
 *         description: Node details retrieved successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Node not found
 */
router.get('/:id', requireAuth, nodeController.getNodeDetails);

router.put(
  '/:id/checklists/:checklistId/toggle',
  requireAuth,
  nodeController.toggleChecklistProgress
);

router.put('/:id/progress', requireAuth, nodeController.updateNodeProgress);

/**
 * @swagger
 * /api/nodes/{id}/details:
 *   put:
 *     tags:
 *       - Node
 *     summary: Đồng bộ Checklists và Materials của một Node (Mentor owner)
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
 *               checklists:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     orderIndex:
 *                       type: integer
 *                     xpReward:
 *                       type: integer
 *               materials:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     url:
 *                       type: string
 *                     type:
 *                       type: string
 *     responses:
 *       200:
 *         description: Node details synchronized successfully
 *       400:
 *         description: Validation error or roadmap is published
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Node not found
 */
router.put(
  '/:id/details',
  requireAuth,
  requireRole(['MENTOR']),
  validateSchema(syncNodeDetailsSchema),
  nodeController.syncNodeDetails
);

module.exports = router;
