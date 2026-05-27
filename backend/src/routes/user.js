const Router = require('express').Router;
const userController = require('../controllers/userController');
const validateSchema = require('../middleware/validateSchema');
const { requireAuth } = require('../middleware/auth');
const {
  updateUserSchema,
  updateUserRoleSchema,
} = require('../validators/user.validator');

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - User
 *     summary: List all users
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
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', requireAuth, userController.getUsers);

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     tags:
 *       - User
 *     summary: Search users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/search', requireAuth, userController.searchUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by ID
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
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:id', requireAuth, userController.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user by ID
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
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put(
  '/:id',
  requireAuth,
  validateSchema(updateUserSchema),
  userController.updateUser
);

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user role
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
 *             $ref: '#/components/schemas/UserRoleUpdateRequest'
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put(
  '/:id/role',
  requireAuth,
  validateSchema(updateUserRoleSchema),
  userController.updateUserRole
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user by ID
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
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/:id', requireAuth, userController.deleteUser);

module.exports = router;
