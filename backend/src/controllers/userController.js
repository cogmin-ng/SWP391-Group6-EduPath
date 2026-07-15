const userService = require('../services/userService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.getAdminDashboardStats = asyncHandler(async (req, res) => {
  const stats = await userService.getDashboardStats();

  return sendSuccess(res, {
    message: 'Dashboard stats retrieved successfully',
    data: stats,
  });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const { skip, take } = req.query;
  const { users, total } = await userService.getUsers({
    skip: Number(skip) || 0,
    take: Number(take) || 10,
  });

  return sendSuccess(res, {
    message: 'Users retrieved successfully',
    data: { users, total },
  });
});

exports.searchUsers = asyncHandler(async (req, res) => {
  const { q, skip, take } = req.query;
  const { users, total } = await userService.searchUsers({
    query: q || '',
    skip: Number(skip) || 0,
    take: Number(take) || 10,
  });

  return sendSuccess(res, {
    message: 'Users searched successfully',
    data: { users, total },
  });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  return sendSuccess(res, {
    message: 'User retrieved successfully',
    data: user,
  });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.updateUser(id, req.body, req.user?.id);

  return sendSuccess(res, {
    message: 'User updated successfully',
    data: user,
  });
});

exports.updateUserAvatar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.updateUserAvatar(id, req.file, req.user?.id);

  return sendSuccess(res, {
    message: 'User avatar updated successfully',
    data: user,
  });
});

exports.updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.updateUserRole(id, req.body, req.user?.id);

  return sendSuccess(res, {
    message: 'User role updated successfully',
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await userService.deleteUser(id, req.user?.id);

  return sendSuccess(res, {
    message: 'User deleted successfully',
  });
});
