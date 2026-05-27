const prisma = require('../lib/prisma');

exports.findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
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

exports.findByIdWithRole = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: { role: { select: { name: true } } },
  });
};
