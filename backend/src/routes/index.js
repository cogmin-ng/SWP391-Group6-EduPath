const Router = require('express').Router;
const authRoutes = require('./auth');
const roleRoutes = require('./role');

const router = Router();

router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);

module.exports = router;
