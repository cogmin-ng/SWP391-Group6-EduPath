const Router = require('express').Router;
const questionBankController = require('../controllers/questionBankController');
const { requireAuth, requireRole } = require('../middleware/auth');
const validateSchema = require('../middleware/validateSchema');
const {
  createQuestionSchema,
  updateQuestionSchema,
} = require('../validators/questionBank.validator');

const router = Router();

// Apply auth and role middleware to all routes in this file
router.use(requireAuth);
router.use(requireRole(['MENTOR']));

router.get('/', questionBankController.getQuestionBank);

router.post(
  '/',
  validateSchema(createQuestionSchema),
  questionBankController.createBankQuestion
);

router.put(
  '/:id',
  validateSchema(updateQuestionSchema),
  questionBankController.updateBankQuestion
);

router.delete('/:id', questionBankController.deleteBankQuestion);

module.exports = router;
