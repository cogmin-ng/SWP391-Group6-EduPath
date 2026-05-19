const prisma = require('../lib/prisma');

exports.findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

exports.create = async ({ email, passwordHash }) => {
  return prisma.user.create({ data: { email, passwordHash } });
};

exports.findById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};
