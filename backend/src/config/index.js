require('dotenv').config();
const Joi = require('joi');

const schema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  PORT: Joi.number().default(4000),
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  CORS_ORIGINS: Joi.string().default('http://localhost:3000'),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: Joi.number().default(100),
}).unknown(true);

const { value, error } = schema.validate(process.env, {
  abortEarly: false,
  stripUnknown: false,
});

if (error) {
  console.error('Invalid environment configuration');
  error.details.forEach((detail) => console.error(`- ${detail.message}`));
  process.exit(1);
}

const corsOrigins = value.CORS_ORIGINS.split(',').map((item) => item.trim());
const cloudinaryCloudName =
  value.CLOUDINARY_CLOUD_NAME || value.CLOUD_NAME || '';
const cloudinaryApiKey = value.CLOUDINARY_API_KEY || value.API_KEY || '';
const cloudinaryApiSecret =
  value.CLOUDINARY_API_SECRET || value.API_SECRET || '';

module.exports = {
  databaseUrl: value.DATABASE_URL,
  port: value.PORT,
  nodeEnv: value.NODE_ENV,
  jwt: {
    accessSecret: value.JWT_ACCESS_SECRET,
    refreshSecret: value.JWT_REFRESH_SECRET,
  },
  cors: {
    origins: corsOrigins,
  },
  rateLimit: {
    windowMs: value.RATE_LIMIT_WINDOW_MS,
    max: value.RATE_LIMIT_MAX,
  },
  cloudinary: {
    cloudName: cloudinaryCloudName || null,
    apiKey: cloudinaryApiKey || null,
    apiSecret: cloudinaryApiSecret || null,
    uploadFolder: value.CLOUDINARY_UPLOAD_FOLDER || 'edupath',
    enabled: Boolean(
      cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret
    ),
  },
};
