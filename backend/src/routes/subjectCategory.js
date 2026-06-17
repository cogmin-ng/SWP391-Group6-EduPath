const Router = require('express').Router;
const subjectCategoryController = require('../controllers/subjectCategoryController');

const router = Router();

/**
 * @swagger
 * /api/subject-categories:
 *   get:
 *     tags:
 *       - Subject Category
 *     summary: Get all active subject categories
 *     responses:
 *       200:
 *         description: List of subject categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 */
router.get('/', subjectCategoryController.getAll);

module.exports = router;
