const Joi = require('joi');

const createRoleSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
});

const updateRoleSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
});

const paginationSchema = Joi.object({
  skip: Joi.number().integer().min(0).optional().default(0),
  take: Joi.number().integer().min(1).max(100).optional().default(10),
});

module.exports = {
  createRoleSchema,
  updateRoleSchema,
  paginationSchema,
};
