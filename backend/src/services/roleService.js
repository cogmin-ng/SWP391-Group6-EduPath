const roleRepository = require('../repositories/roleRepository');
const ApiError = require('../utils/ApiError');

const roleMessages = {
  notFound: 'Role not found',
  nameAlreadyExists: 'Role name already exists',
  invalidId: 'Invalid role id',
};

exports.getRoles = async ({ skip = 0, take = 10 }) => {
  const [roles, total] = await Promise.all([
    roleRepository.findAll({ skip, take }),
    roleRepository.count(),
  ]);

  return { roles, total };
};

exports.searchRoles = async ({ query, skip = 0, take = 10 }) => {
  const [roles, total] = await Promise.all([
    roleRepository.search({ query, skip, take }),
    roleRepository.searchCount(query),
  ]);

  return { roles, total };
};

exports.getRoleById = async (id) => {
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, roleMessages.invalidId);
  }

  const role = await roleRepository.findById(id);
  if (!role) {
    throw new ApiError(404, roleMessages.notFound);
  }

  return role;
};

exports.createRole = async ({ name }, userId) => {
  const existing = await roleRepository.findByName(name);
  if (existing) {
    throw new ApiError(400, roleMessages.nameAlreadyExists);
  }

  return roleRepository.create({
    name,
    createdBy: userId || null,
    updatedBy: userId || null,
  });
};

exports.updateRole = async (id, data, userId) => {
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, roleMessages.invalidId);
  }

  const role = await roleRepository.findById(id);
  if (!role) {
    throw new ApiError(404, roleMessages.notFound);
  }

  if (data.name && data.name !== role.name) {
    const existing = await roleRepository.findByName(data.name);
    if (existing) {
      throw new ApiError(400, roleMessages.nameAlreadyExists);
    }
  }

  return roleRepository.update(id, {
    ...data,
    updatedBy: userId || role.updatedBy,
  });
};

exports.deleteRole = async (id, userId) => {
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, roleMessages.invalidId);
  }

  const role = await roleRepository.findById(id);
  if (!role) {
    throw new ApiError(404, roleMessages.notFound);
  }

  return roleRepository.softDelete(id, {
    updatedBy: userId || role.updatedBy,
  });
};
