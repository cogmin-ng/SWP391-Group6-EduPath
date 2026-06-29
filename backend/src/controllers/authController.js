const authService = require('../services/authService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { auth: authMessages } = require('../constants/messages');

exports.register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  const user = await authService.register({ email, password, name });
  return sendSuccess(res, {
    statusCode: 201,
    message: authMessages.registerSuccess,
    data: { id: user.id, email: user.email, name: user.name },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  return sendSuccess(res, {
    message: authMessages.loginSuccess,
    data: result,
  });
});

exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refresh({ refreshToken });
  return sendSuccess(res, {
    message: authMessages.refreshSuccess,
    data: result,
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await authService.logout({ refreshToken });
  return sendSuccess(res, {
    message: authMessages.logoutSuccess,
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return sendSuccess(res, {
    data: user,
  });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword({ email });
  return sendSuccess(res, {
    message: 'Nếu email tồn tại, mã đặt lại mật khẩu đã được gửi.',
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword({ email, otp, newPassword });
  return sendSuccess(res, {
    message: 'Mật khẩu đã được đặt lại thành công.',
  });
});

