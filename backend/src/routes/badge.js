const Router = require('express').Router;
const badgeController = require('../controllers/badgeController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

// Retrieve all badges for the logged in user
router.get('/', requireAuth, badgeController.getMyBadges);

// Manually unlock a badge for the logged in user
router.post('/:badgeId/unlock', requireAuth, badgeController.unlockBadge);

module.exports = router;
