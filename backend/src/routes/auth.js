const Router = require('express').Router;
const authController = require('../controllers/authController');
const validateSchema = require('../middleware/validateSchema');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} = require('../validators/auth.validator');

const router = Router();

router.post(
  '/register',
  validateSchema(registerSchema),
  authController.register
);

router.post('/login', validateSchema(loginSchema), authController.login);

router.post(
  '/refresh',
  validateSchema(refreshTokenSchema),
  authController.refresh
);

router.post(
  '/logout',
  validateSchema(refreshTokenSchema),
  authController.logout
);

module.exports = router;
