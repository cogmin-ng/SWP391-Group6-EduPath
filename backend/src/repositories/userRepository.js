const prisma = require('../lib/prisma');

const ACTIVE_USER_FILTER = { isDeleted: false };

exports.findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

exports.findByEmailActive = async (email) => {
  return prisma.user.findFirst({
    where: { email, ...ACTIVE_USER_FILTER },
  });
};

exports.create = async ({ email, passwordHash, name, roleId }) => {
  const data = { email, passwordHash, name };
  if (roleId) {
    data.role = { connect: { id: roleId } };
  }
  return prisma.user.create({ data });
};

exports.findById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

exports.findByIdActive = async (id) => {
  return prisma.user.findFirst({
    where: { id, ...ACTIVE_USER_FILTER },
  });
};

exports.findByIdWithRole = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: { role: { select: { name: true } } },
  });
};

exports.findByIdWithRoles = async (id) => {
  return prisma.user.findFirst({
    where: { id, ...ACTIVE_USER_FILTER },
    include: { role: true },
  });
};

exports.findAll = async ({ skip = 0, take = 10 } = {}) => {
  return prisma.user.findMany({
    where: ACTIVE_USER_FILTER,
    include: {
      role: true,
    },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });
};

exports.count = async () => {
  return prisma.user.count({ where: ACTIVE_USER_FILTER });
};

exports.search = async ({ query, skip = 0, take = 10 }) => {
  return prisma.user.findMany({
    where: {
      ...ACTIVE_USER_FILTER,
      OR: [
        { email: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      role: true,
    },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });
};

exports.searchCount = async (query) => {
  return prisma.user.count({
    where: {
      ...ACTIVE_USER_FILTER,
      OR: [
        { email: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
      ],
    },
  });
};

exports.update = async (id, data, tx = prisma) => {
  return tx.user.update({
    where: { id },
    data,
  });
};

exports.softDelete = async (id, data = {}, tx = prisma) => {
  return tx.user.update({
    where: { id },
    data: { isDeleted: true, updatedAt: new Date(), ...data },
  });
};
