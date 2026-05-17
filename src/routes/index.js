const Router = require('express').Router;
const authRoutes = require('./auth');

const router = Router();

router.use('/auth', authRoutes);

module.exports = router;
