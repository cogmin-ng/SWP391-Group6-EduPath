const Router = require('express').Router;
const learningPathController = require('../controllers/learningPathController');

const router = Router();

/**
 * @swagger
 * /api/learning-paths/hot:
 *   get:
 *     tags:
 *       - Learning Path
 *     summary: Get hot/trending learning paths sorted by popularity
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 9
 *     responses:
 *       200:
 *         description: Paginated list of hot learning paths
 */
router.get('/hot', learningPathController.getHotLearningPaths);

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
