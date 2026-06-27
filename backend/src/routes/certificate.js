const Router = require('express').Router;
const certificateController = require('../controllers/certificateController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

/**
 * @swagger
 * /api/certificates/my:
 *   get:
 *     tags:
 *       - Certificate
 *     summary: Get all certificates of the current user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of certificates
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
 *                     $ref: '#/components/schemas/CertificateResponse'
 *             example:
 *               success: true
 *               message: Certificates retrieved successfully
 *               data:
 *                 - id: "clxyz123"
 *                   learningPathTitle: "React Fundamentals"
 *                   mentorName: "John Doe"
 *                   issuedAt: "2026-06-20T10:00:00.000Z"
 *                   certificateUrl: null
 *                   verificationId: "550e8400-e29b-41d4-a716-446655440000"
 *       401:
 *         description: Unauthorized
 */
router.get('/my', requireAuth, certificateController.getMyCertificates);

/**
 * @swagger
 * /api/certificates/verify/{verificationId}:
 *   get:
 *     tags:
 *       - Certificate
 *     summary: Verify a certificate (Public)
 *     parameters:
 *       - name: verificationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Certificate verification ID (UUID)
 *     responses:
 *       200:
 *         description: Certificate verification result
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
 *                   $ref: '#/components/schemas/CertificateVerifyResponse'
 *             examples:
 *               valid:
 *                 summary: Valid certificate
 *                 value:
 *                   success: true
 *                   message: Certificate is valid
 *                   data:
 *                     valid: true
 *                     learningPath: "React Fundamentals"
 *                     mentor: "John Doe"
 *                     issueDate: "2026-06-20T10:00:00.000Z"
 *               invalid:
 *                 summary: Invalid certificate
 *                 value:
 *                   success: true
 *                   message: Certificate not found or invalid
 *                   data:
 *                     valid: false
 */
router.get(
  '/verify/:verificationId',
  certificateController.verifyCertificate
);

/**
 * @swagger
 * /api/certificates/{id}:
 *   get:
 *     tags:
 *       - Certificate
 *     summary: Get certificate detail
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Certificate ID
 *     responses:
 *       200:
 *         description: Certificate detail
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
 *                   $ref: '#/components/schemas/CertificateResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied - not the certificate owner
 *       404:
 *         description: Certificate not found
 */
router.get('/:id', requireAuth, certificateController.getCertificateDetail);

/**
 * @swagger
 * /api/certificates/{id}/download:
 *   get:
 *     tags:
 *       - Certificate
 *     summary: Download certificate
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Certificate ID
 *     responses:
 *       200:
 *         description: Certificate download URL
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
 *                   properties:
 *                     certificateUrl:
 *                       type: string
 *                       format: uri
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied - not the certificate owner
 *       404:
 *         description: Certificate not found or file not available
 */
router.get(
  '/:id/download',
  requireAuth,
  certificateController.downloadCertificate
);

module.exports = router;
