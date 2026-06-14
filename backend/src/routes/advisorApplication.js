const Router = require('express').Router;
const advisorApplicationController = require('../controllers/advisorApplicationController');
const { requireAuth, requireRole } = require('../middleware/auth');
const validateSchema = require('../middleware/validateSchema');
const { createAdvisorApplicationSchema } = require('../validators/advisorApplication.validator');

const router = Router();

/**
 * @swagger
 * /api/advisor-applications:
 *   post:
 *     tags:
 *       - AdvisorApplication
 *     summary: Submit a new mentor application (Mentee only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - specialization
 *               - currentSemester
 *               - bio
 *               - experience
 *               - subjectIds
 *               - academicRecords
 *             properties:
 *               specialization:
 *                 type: string
 *               currentSemester:
 *                 type: string
 *               bio:
 *                 type: string
 *               experience:
 *                 type: string
 *               transcriptUrl:
 *                 type: string
 *               subjectIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               academicRecords:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     subjectId:
 *                       type: string
 *                     grade:
 *                       type: number
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Already has a pending application
 */
router.post(
  '/',
  requireAuth,
  requireRole(['MENTEE']),
  validateSchema(createAdvisorApplicationSchema),
  advisorApplicationController.createApplication
);

/**
 * @swagger
 * /api/advisor-applications/me:
 *   get:
 *     tags:
 *       - AdvisorApplication
 *     summary: Get current user's latest application
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Application details (or null if none)
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
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/me',
  requireAuth,
  advisorApplicationController.getMyApplication
);

/**
 * @swagger
 * /api/advisor-applications/all:
 *   get:
 *     tags:
 *       - AdvisorApplication
 *     summary: Get all applications (Admin only)
 *     security:
 *       - BearerAuth: []
 */
router.get(
  '/all',
  requireAuth,
  requireRole(['ADMIN']),
  advisorApplicationController.getAllApplications
);

/**
 * @swagger
 * /api/advisor-applications/{id}/status:
 *   put:
 *     tags:
 *       - AdvisorApplication
 *     summary: Update application status (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               rejectReason:
 *                 type: string
 */
router.put(
  '/:id/status',
  requireAuth,
  requireRole(['ADMIN']),
  advisorApplicationController.updateApplicationStatus
);

module.exports = router;
