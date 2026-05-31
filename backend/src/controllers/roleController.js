const roleService = require('../services/roleService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.getRoles = asyncHandler(async (req, res) => {
  const { skip, take } = req.query;
  const { roles, total } = await roleService.getRoles({
    skip: Number(skip) || 0,
    take: Number(take) || 10,
  });

  return sendSuccess(res, {
    message: 'Roles retrieved successfully',
    data: { roles, total },
  });
});

exports.searchRoles = asyncHandler(async (req, res) => {
  const { q, skip, take } = req.query;
  const { roles, total } = await roleService.searchRoles({
    query: q || '',
    skip: Number(skip) || 0,
    take: Number(take) || 10,
  });

  return sendSuccess(res, {
    message: 'Roles searched successfully',
    data: { roles, total },
  });
});

exports.getRoleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const role = await roleService.getRoleById(id);

  return sendSuccess(res, {
    message: 'Role retrieved successfully',
    data: role,
  });
});

exports.createRole = asyncHandler(async (req, res) => {
  const role = await roleService.createRole(req.body, req.user?.id);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Role created successfully',
    data: role,
  });
});

exports.updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const role = await roleService.updateRole(id, req.body, req.user?.id);

  return sendSuccess(res, {
    message: 'Role updated successfully',
    data: role,
  });
});

exports.deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await roleService.deleteRole(id, req.user?.id);

  return sendSuccess(res, {
    message: 'Role deleted successfully',
  });
});
