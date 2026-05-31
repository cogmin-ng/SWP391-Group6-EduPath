const prisma = require('../lib/prisma');

const ACTIVE_ROLE_FILTER = { isDeleted: false };

exports.findById = async (id) => {
  return prisma.role.findFirst({
    where: {
      id,
      ...ACTIVE_ROLE_FILTER,
    },
  });
};

exports.findByName = async (name) => {
  return prisma.role.findFirst({
    where: {
      name,
      ...ACTIVE_ROLE_FILTER,
    },
  });
};

exports.findAll = async ({ skip = 0, take = 10 } = {}) => {
  return prisma.role.findMany({
    where: ACTIVE_ROLE_FILTER,
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });
};

exports.count = async () => {
  return prisma.role.count({ where: ACTIVE_ROLE_FILTER });
};

exports.search = async ({ query, skip = 0, take = 10 }) => {
  return prisma.role.findMany({
    where: {
      ...ACTIVE_ROLE_FILTER,
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });
};

exports.searchCount = async (query) => {
  return prisma.role.count({
    where: {
      ...ACTIVE_ROLE_FILTER,
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
  });
};

exports.create = async (data) => {
  return prisma.role.create({ data });
};

exports.update = async (id, data) => {
  return prisma.role.update({
    where: { id },
    data,
  });
};

exports.softDelete = async (id, data = {}) => {
  return prisma.role.update({
    where: { id },
    data: { isDeleted: true, updatedAt: new Date(), ...data },
  });
};

exports.countUsersWithRole = async (roleId) => {
  return prisma.user.count({ where: { roleId } });
};
