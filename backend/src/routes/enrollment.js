const Router = require('express').Router;
const enrollmentController = require('../controllers/enrollmentController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.post('/slug/:slug', requireAuth, enrollmentController.enrollBySlug);
router.get(
  '/slug/:slug',
  requireAuth,
  enrollmentController.getMyEnrollmentBySlug
);
router.patch(
  '/slug/:slug/progress',
  requireAuth,
  enrollmentController.updateEnrollmentProgressBySlug
);

module.exports = router;
