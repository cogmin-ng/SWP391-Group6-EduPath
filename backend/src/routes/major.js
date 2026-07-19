const Router = require('express').Router;
const majorController = require('../controllers/majorController');

const router = Router();

/**
 * @swagger
 * /api/majors:
 *   get:
 *     tags:
 *       - Major
 *     summary: Get all active majors
 *     responses:
 *       200:
 *         description: List of active majors
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
 *                       code:
 *                         type: string
 */
router.get('/', majorController.getAll);

module.exports = router;
