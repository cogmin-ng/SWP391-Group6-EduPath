const Joi = require('joi');

const sendOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otpType: Joi.string().optional(),
});

const resendOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otpType: Joi.string().optional(),
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().trim().length(6).required(),
  otpType: Joi.string().optional(),
});

module.exports = {
  sendOtpSchema,
  resendOtpSchema,
  verifyOtpSchema,
};
