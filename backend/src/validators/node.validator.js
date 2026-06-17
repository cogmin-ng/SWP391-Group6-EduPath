const Joi = require('joi');

const checklistSchema = Joi.object({
  id: Joi.string().allow('', null).optional(),
  title: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
  orderIndex: Joi.number().integer().min(0).optional(),
  xpReward: Joi.number().integer().min(0).default(10).optional(),
});

const materialSchema = Joi.object({
  id: Joi.string().allow('', null).optional(),
  title: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
  url: Joi.string().uri().allow('', null).optional(), // optional per my question, in case no UI for it yet
  type: Joi.string().required(),
});

exports.syncNodeDetailsSchema = Joi.object({
  checklists: Joi.array().items(checklistSchema).optional(),
  materials: Joi.array().items(materialSchema).optional(),
});
