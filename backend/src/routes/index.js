const Router = require('express').Router;
const authRoutes = require('./auth');
const roleRoutes = require('./role');
const userRoutes = require('./user');

const router = Router();

router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);

module.exports = router;
