const authService = require('../services/authService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { auth: authMessages } = require('../constants/messages');

exports.register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.register({ email, password });
  return sendSuccess(res, {
    statusCode: 201,
    message: authMessages.registerSuccess,
    data: { id: user.id, email: user.email },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const tokens = await authService.login({ email, password });
  return sendSuccess(res, {
    message: authMessages.loginSuccess,
    data: tokens,
  });
});

exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refresh({ refreshToken });
  return sendSuccess(res, {
    message: authMessages.refreshSuccess,
    data: tokens,
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await authService.logout({ refreshToken });
  return sendSuccess(res, {
    message: authMessages.logoutSuccess,
  });
});
