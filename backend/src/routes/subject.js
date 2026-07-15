const Router = require('express').Router;
const subjectController = require('../controllers/subjectController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = Router();

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     tags:
 *       - Subject
 *     summary: Get all active subjects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of subjects
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/', requireAuth, subjectController.getAll);
router.post('/', requireAuth, requireRole(['ADMIN']), subjectController.create);
router.put('/:id', requireAuth, requireRole(['ADMIN']), subjectController.update);
router.delete('/:id', requireAuth, requireRole(['ADMIN']), subjectController.delete);

module.exports = router;
