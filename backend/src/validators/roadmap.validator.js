const Joi = require('joi');

const roadmapNodeSchema = Joi.object({
  id: Joi.any().optional(), // Can have temporary client-side IDs
  title: Joi.string().trim().required().messages({
    'string.empty': 'Node title is required',
    'any.required': 'Node title is required',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  orderIndex: Joi.number().integer().min(0).optional(),
  duration: Joi.string().trim().allow('', null).optional(), // Allowed for compatibility with frontend
});

const createRoadmapSchema = Joi.object({
  title: Joi.string().trim().optional().messages({
    'string.empty': 'Roadmap title is required',
  }),
  name: Joi.string().trim().optional().messages({
    'string.empty': 'Roadmap name is required',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  subjectId: Joi.string().trim().allow('', null).optional(),
  category: Joi.string().trim().allow('', null).optional(),
  level: Joi.string().trim().allow('', null).optional(),
  thumbnail: Joi.string().trim().allow('', null).optional(),
  status: Joi.string()
    .valid('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'PUBLISHED')
    .default('DRAFT'),
  xpReward: Joi.number().integer().min(0).default(0),
  nodes: Joi.array().items(roadmapNodeSchema).optional(),
}).custom((value, helpers) => {
  // Ensure either title or name is provided
  if (!value.title && !value.name) {
    return helpers.message({ custom: 'Roadmap title/name is required' });
  }
  return value;
});

const updateRoadmapSchema = Joi.object({
  title: Joi.string().trim().optional(),
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().allow('', null).optional(),
  subjectId: Joi.string().trim().allow('', null).optional(),
  category: Joi.string().trim().allow('', null).optional(),
  level: Joi.string().trim().allow('', null).optional(),
  thumbnail: Joi.string().trim().allow('', null).optional(),
  status: Joi.string()
    .valid('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'PUBLISHED')
    .optional(),
  xpReward: Joi.number().integer().min(0).optional(),
  nodes: Joi.array().items(roadmapNodeSchema).optional(),
});

module.exports = {
  createRoadmapSchema,
  updateRoadmapSchema,
};
