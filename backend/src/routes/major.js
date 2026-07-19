const Router = require('express').Router;
const majorController = require('../controllers/majorController');

const router = Router();

/**
 * GET /api/majors
 * Public - returns active majors
 */
router.get('/', majorController.getAll);

module.exports = router;
