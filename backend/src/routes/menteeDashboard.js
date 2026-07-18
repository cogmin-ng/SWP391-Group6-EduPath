const Router = require('express').Router;
const menteeDashboardController = require('../controllers/menteeDashboardController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = Router();

router.get(
  '/leaderboard',
  requireAuth,
  requireRole(['MENTEE']),
  menteeDashboardController.getLeaderboard
);

router.get(
  '/',
  requireAuth,
  requireRole(['MENTEE']),
  menteeDashboardController.getDashboard
);

module.exports = router;
