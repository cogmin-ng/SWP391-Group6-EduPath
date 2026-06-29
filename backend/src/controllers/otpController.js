const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');
const otpService = require('../services/otpService');

exports.sendOtp = asyncHandler(async (req, res) => {
  const { email, otpType } = req.body;
  const result = await otpService.sendOtp({ email, otpType });
  return sendSuccess(res, {
    statusCode: 200,
    message: 'OTP sent successfully',
    data: result,
  });
});

exports.resendOtp = asyncHandler(async (req, res) => {
  const { email, otpType } = req.body;
  const result = await otpService.resendOtp({ email, otpType });
  return sendSuccess(res, {
    statusCode: 200,
    message: 'OTP resent successfully',
    data: result,
  });
});

exports.verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp, otpType } = req.body;
  const result = await otpService.verifyOtp({ email, otp, otpType });
  return sendSuccess(res, {
    statusCode: 200,
    message: 'OTP verified successfully',
    data: result,
  });
});
