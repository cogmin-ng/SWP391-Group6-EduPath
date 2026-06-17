const Router = require('express').Router;
const authRoutes = require('./auth');
const uploadRoutes = require('./upload');
const roleRoutes = require('./role');
const userRoutes = require('./user');
const tipRoutes = require('./tip');
const notificationRoutes = require('./notification');
const subjectRoutes = require('./subject');
const subjectCategoryRoutes = require('./subjectCategory');
const learningPathRoutes = require('./learningPath');
const advisorApplicationRoutes = require('./advisorApplication');
const quizRoutes = require('./quiz');
const quizController = require('../controllers/quizController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = Router();

router.use('/auth', authRoutes);
router.use('/uploads', uploadRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/tips', tipRoutes);
router.use('/notifications', notificationRoutes);
router.use('/subjects', subjectRoutes);
router.use('/subject-categories', subjectCategoryRoutes);
router.use('/learning-paths', learningPathRoutes);
router.use('/advisor-applications', advisorApplicationRoutes);
router.use('/quizzes', quizRoutes);

// Node-scoped quiz endpoint
router.get(
  '/nodes/:nodeId/quizzes',
  requireAuth,
  requireRole(['MENTOR']),
  quizController.getQuizzesByNode
);

module.exports = router;
