const prisma = require('../lib/prisma');

exports.findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

exports.create = async ({ email, passwordHash, name }) => {
  return prisma.user.create({ data: { email, passwordHash, name } });
};

exports.findById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

exports.findByIdWithRoles = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: { roles: { select: { name: true } } },
  });
};
