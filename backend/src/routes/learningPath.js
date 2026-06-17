const Router = require('express').Router;
const learningPathController = require('../controllers/learningPathController');

const router = Router();

/**
 * @swagger
 * /api/learning-paths/explore:
 *   get:
 *     tags:
 *       - Learning Path
 *     summary: Get learning paths for explore page
 *     responses:
 *       200:
 *         description: List of learning paths
 */
router.get('/explore', learningPathController.getExploreList);

module.exports = router;
