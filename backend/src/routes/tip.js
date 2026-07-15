const Router = require('express').Router;
const tipController = require('../controllers/tipController');
const { requireAuth, requireRole } = require('../middleware/auth');
const validateSchema = require('../middleware/validateSchema');
const {
  submitTipSchema,
  rejectTipSchema,
  paginationSchema,
  contributionHistorySchema,
} = require('../validators/tip.validator');

const router = Router();

/**
 * @swagger
 * /api/tips/submit:
 *   post:
 *     tags:
 *       - Tip
 *     summary: Submit a new tip (Mentee only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipSubmitRequest'
 *     responses:
 *       201:
 *         description: Tip submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/TipResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not enrolled in this learning path
 */
router.post(
  '/submit',
  requireAuth,
  requireRole(['MENTEE']),
  validateSchema(submitTipSchema),
  tipController.submitTip
);

/**
 * @swagger
 * /api/tips/node/{nodeId}:
 *   get:
 *     tags:
 *       - Tip
 *     summary: Get published tips for a specific node
 *     parameters:
 *       - name: nodeId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Node ID
 *     responses:
 *       200:
 *         description: List of published tips
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TipResponse'
 *       404:
 *         description: Node not found
 */
router.get('/node/:nodeId', tipController.getTipsByNode);

/**
 * @swagger
 * /api/tips/my-contributions:
 *   get:
 *     tags:
 *       - Tip
 *     summary: Get mentee's tip contribution history
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
 *           default: 10
 *     responses:
 *       200:
 *         description: Contribution history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/TipListResponse'
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/my-contributions',
  requireAuth,
  requireRole(['MENTEE']),
  validateSchema(contributionHistorySchema, 'query'),
  tipController.getContributionHistory
);

/**
 * @swagger
 * /api/tips/pending:
 *   get:
 *     tags:
 *       - Tip
 *     summary: Get pending tips for mentor's roadmaps
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
 *           default: 10
 *     responses:
 *       200:
 *         description: List of pending tips
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/TipListResponse'
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/pending',
  requireAuth,
  requireRole(['MENTOR']),
  validateSchema(paginationSchema),
  tipController.getPendingTips
);

/**
 * @swagger
 * /api/tips/{id}/approve:
 *   put:
 *     tags:
 *       - Tip
 *     summary: Approve a pending tip (Mentor only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Tip ID
 *     responses:
 *       200:
 *         description: Tip approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/TipResponse'
 *       400:
 *         description: Tip cannot be approved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Tip not found
 */
router.put(
  '/:id/approve',
  requireAuth,
  requireRole(['MENTOR']),
  tipController.approveTip
);

/**
 * @swagger
 * /api/tips/{id}/reject:
 *   put:
 *     tags:
 *       - Tip
 *     summary: Reject a pending tip with reason (Mentor only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Tip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipRejectRequest'
 *     responses:
 *       200:
 *         description: Tip rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/TipResponse'
 *       400:
 *         description: Invalid input or tip cannot be rejected
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Tip not found
 */
router.put(
  '/:id/reject',
  requireAuth,
  requireRole(['MENTOR']),
  validateSchema(rejectTipSchema),
  tipController.rejectTip
);

/**
 * @swagger
 * /api/tips/{id}:
 *   get:
 *     tags:
 *       - Tip
 *     summary: Get a single tip by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Tip ID
 *     responses:
 *       200:
 *         description: Tip details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/TipResponse'
 *       404:
 *         description: Tip not found
 */
router.get('/:id', tipController.getTipById);

module.exports = router;
