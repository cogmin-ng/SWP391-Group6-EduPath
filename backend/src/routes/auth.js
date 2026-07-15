const Router = require('express').Router;
const authController = require('../controllers/authController');
const validateSchema = require('../middleware/validateSchema');
const { requireAuth } = require('../middleware/auth');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validators/auth.validator');

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input
 */
router.post(
  '/register',
  validateSchema(registerSchema),
  authController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateSchema(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid refresh token
 */
router.post(
  '/refresh',
  validateSchema(refreshTokenSchema),
  authController.refresh
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Send a password reset code to email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset email sent if the account exists
 */
router.post(
  '/forgot-password',
  validateSchema(forgotPasswordSchema),
  authController.forgotPassword
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset password using OTP code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Password reset failed
 */
router.post(
  '/reset-password',
  validateSchema(resetPasswordSchema),
  authController.resetPassword
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post(
  '/logout',
  validateSchema(refreshTokenSchema),
  authController.logout
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current user profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', requireAuth, authController.getMe);

module.exports = router;
