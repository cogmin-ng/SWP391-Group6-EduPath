const Router = require('express').Router;
const roleController = require('../controllers/roleController');
const validateSchema = require('../middleware/validateSchema');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  createRoleSchema,
  updateRoleSchema,
} = require('../validators/role.validator');

const router = Router();

/**
 * @swagger
 * /api/roles:
 *   get:
 *     tags:
 *       - Role
 *     summary: List all roles
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
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleListResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', requireAuth, roleController.getRoles);

/**
 * @swagger
 * /api/roles/search:
 *   get:
 *     tags:
 *       - Role
 *     summary: Search roles
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: query
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
 *               $ref: '#/components/schemas/RoleListResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/search', requireAuth, roleController.searchRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     tags:
 *       - Role
 *     summary: Get role by ID
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
 *         description: Role details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role not found
 */
router.get('/:id', requireAuth, roleController.getRoleById);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     tags:
 *       - Role
 *     summary: Create a new role
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleCreateRequest'
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  requireAuth,
  requireRole(['ADMIN']),
  validateSchema(createRoleSchema),
  roleController.createRole
);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     tags:
 *       - Role
 *     summary: Update role by ID
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
 *             $ref: '#/components/schemas/RoleUpdateRequest'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role not found
 */
router.put(
  '/:id',
  requireAuth,
  requireRole(['ADMIN']),
  validateSchema(updateRoleSchema),
  roleController.updateRole
);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     tags:
 *       - Role
 *     summary: Delete role by ID
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
 *         description: Role deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role not found
 */
router.delete('/:id', requireAuth, requireRole(['ADMIN']), roleController.deleteRole);

module.exports = router;
