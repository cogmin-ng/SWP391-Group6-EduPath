const Router = require('express').Router;
const otpController = require('../controllers/otpController');
const validateSchema = require('../middleware/validateSchema');
const {
  sendOtpSchema,
  resendOtpSchema,
  verifyOtpSchema,
} = require('../validators/otp.validator');

const router = Router();

/**
 * @swagger
 * /api/otp/send-otp:
 *   post:
 *     tags:
 *       - OTP
 *     summary: Send a one-time email verification code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendOtpRequest'
 *     responses:
 *       200:
 *         description: OTP email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OtpSendResponse'
 *       400:
 *         description: Validation failed or input is invalid
 *       404:
 *         description: User not found
 */
router.post('/send-otp', validateSchema(sendOtpSchema), otpController.sendOtp);

/**
 * @swagger
 * /api/otp/resend-otp:
 *   post:
 *     tags:
 *       - OTP
 *     summary: Resend a one-time email verification code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendOtpRequest'
 *     responses:
 *       200:
 *         description: OTP email resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OtpSendResponse'
 *       400:
 *         description: Validation failed or input is invalid
 *       404:
 *         description: User not found
 */
router.post(
  '/resend-otp',
  validateSchema(resendOtpSchema),
  otpController.resendOtp
);

/**
 * @swagger
 * /api/otp/verify-otp:
 *   post:
 *     tags:
 *       - OTP
 *     summary: Verify an OTP code sent via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpRequest'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OtpVerifyResponse'
 *       400:
 *         description: Validation failed or input is invalid
 *       401:
 *         description: OTP invalid or expired
 *       404:
 *         description: User not found
 */
router.post(
  '/verify-otp',
  validateSchema(verifyOtpSchema),
  otpController.verifyOtp
);

module.exports = router;
