const Joi = require('joi');

const paginationSchema = Joi.object({
  skip: Joi.number().integer().min(0).optional().default(0),
  take: Joi.number().integer().min(1).max(100).optional().default(10),
});

const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  avatar: Joi.string().uri().optional().allow(null),
  bio: Joi.string().trim().max(500).optional().allow(null),
  status: Joi.string()
    .valid('ACTIVE', 'INACTIVE', 'BANNED', 'PENDING')
    .optional(),
});

const updateUserRoleSchema = Joi.object({
  roleId: Joi.string().optional().allow(null),
});

module.exports = {
  paginationSchema,
  updateUserSchema,
  updateUserRoleSchema,
};
