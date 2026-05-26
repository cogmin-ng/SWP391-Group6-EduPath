const Router = require('express').Router;
const roleController = require('../controllers/roleController');
const validateSchema = require('../middleware/validateSchema');
const { requireAuth } = require('../middleware/auth');
const {
  createRoleSchema,
  updateRoleSchema,
} = require('../validators/role.validator');

const router = Router();

router.get('/', requireAuth, roleController.getRoles);
router.get('/search', requireAuth, roleController.searchRoles);
router.get('/:id', requireAuth, roleController.getRoleById);
router.post(
  '/',
  requireAuth,
  validateSchema(createRoleSchema),
  roleController.createRole
);
router.put(
  '/:id',
  requireAuth,
  validateSchema(updateRoleSchema),
  roleController.updateRole
);
router.delete('/:id', requireAuth, roleController.deleteRole);

module.exports = router;
