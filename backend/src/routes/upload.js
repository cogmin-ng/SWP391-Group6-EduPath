const Router = require('express').Router;
const uploadController = require('../controllers/uploadController');
const validateSchema = require('../middleware/validateSchema');
const { requireAuth } = require('../middleware/auth');
const { singleMediaUpload } = require('../middleware/upload');
const {
  uploadMediaSchema,
  deleteMediaSchema,
} = require('../validators/upload.validator');

const router = Router();

/**
 * @swagger
 * /api/uploads/media:
 *   post:
 *     tags:
 *       - Media
 *     summary: Upload an image or video to Cloudinary
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *                 description: Optional Cloudinary folder
 *               resourceType:
 *                 type: string
 *                 enum: [auto, image, video]
 *                 default: auto
 *     responses:
 *       201:
 *         description: Media uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaUploadResponse'
 *       400:
 *         description: Invalid file or request payload
 *       401:
 *         description: Unauthorized
 *       503:
 *         description: Cloudinary is not configured
 */
router.post(
  '/media',
  requireAuth,
  singleMediaUpload,
  validateSchema(uploadMediaSchema),
  uploadController.uploadMedia
);

/**
 * @swagger
 * /api/uploads/media:
 *   delete:
 *     tags:
 *       - Media
 *     summary: Delete a file from Cloudinary
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicId:
 *                 type: string
 *               resourceType:
 *                 type: string
 *                 enum: [image, video, raw]
 *                 default: image
 *             required:
 *               - publicId
 *     responses:
 *       200:
 *         description: Media deleted successfully
 *       400:
 *         description: Invalid delete request
 *       401:
 *         description: Unauthorized
 *       503:
 *         description: Cloudinary is not configured
 */
router.delete(
  '/media',
  requireAuth,
  validateSchema(deleteMediaSchema),
  uploadController.deleteMedia
);

module.exports = router;
