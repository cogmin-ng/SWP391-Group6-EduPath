const Router = require('express').Router;
const authRoutes = require('./auth');
const uploadRoutes = require('./upload');
const roleRoutes = require('./role');
const userRoutes = require('./user');
const tipRoutes = require('./tip');
const notificationRoutes = require('./notification');

const router = Router();

router.use('/auth', authRoutes);
router.use('/uploads', uploadRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/tips', tipRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
