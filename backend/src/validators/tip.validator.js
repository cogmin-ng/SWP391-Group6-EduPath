const Joi = require('joi');

const submitTipSchema = Joi.object({
  nodeId: Joi.string().required(),
  title: Joi.string().trim().max(200).required(),
  content: Joi.string().trim().min(10).max(5000).required(),
});

const approveTipSchema = Joi.object({
  // body trống, dữ liệu lấy từ params
});

const rejectTipSchema = Joi.object({
  rejectReason: Joi.string().trim().min(5).max(500).required(),
});

const paginationSchema = Joi.object({
  skip: Joi.number().integer().min(0).optional().default(0),
  take: Joi.number().integer().min(1).max(100).optional().default(10),
});

const contributionHistorySchema = paginationSchema.keys({
  status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').optional(),
});

module.exports = {
  submitTipSchema,
  approveTipSchema,
  rejectTipSchema,
  paginationSchema,
  contributionHistorySchema,
};
