const Joi = require('joi');

exports.listLearnersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  search: Joi.string().trim().max(100).allow('').default(''),
  status: Joi.string().valid('ACTIVE', 'COMPLETED').optional(),
});

exports.sendReminderSchema = Joi.object({
  title: Joi.string().trim().min(1).max(120).required(),
  content: Joi.string().trim().min(1).max(1000).required(),
});
