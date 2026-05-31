const Joi = require('joi');

const uploadMediaSchema = Joi.object({
  folder: Joi.string().trim().max(255).optional().allow(''),
  resourceType: Joi.string().valid('auto', 'image', 'video').default('auto'),
});

const deleteMediaSchema = Joi.object({
  publicId: Joi.string().trim().min(1).required(),
  resourceType: Joi.string().valid('image', 'video', 'raw').default('image'),
});

module.exports = {
  uploadMediaSchema,
  deleteMediaSchema,
};
