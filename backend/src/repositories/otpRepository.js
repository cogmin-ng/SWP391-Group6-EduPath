const prisma = require('../lib/prisma');

exports.create = async (
  { userId, codeHash, otpType, expiredAt },
  tx = prisma
) => {
  return tx.oTP.create({
    data: {
      userId,
      code: codeHash,
      otpType,
      expiredAt,
    },
  });
};

exports.findLatestActiveByUserAndType = async ({ userId, otpType }) => {
  return prisma.oTP.findFirst({
    where: {
      userId,
      otpType,
      isDeleted: false,
      expiredAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });
};

exports.findLatestByUserAndTypeAll = async ({ userId, otpType }) => {
  return prisma.oTP.findFirst({
    where: {
      userId,
      otpType,
    },
    orderBy: { createdAt: 'desc' },
  });
};

exports.countCreatedSince = async ({ userId, otpType, since }) => {
  return prisma.oTP.count({
    where: {
      userId,
      otpType,
      createdAt: { gte: since },
    },
  });
};

exports.markActiveAsDeletedForUserAndType = async (
  { userId, otpType },
  tx = prisma
) => {
  return tx.oTP.updateMany({
    where: {
      userId,
      otpType,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });
};

exports.consumeById = async (id, tx = prisma) => {
  return tx.oTP.update({
    where: { id },
    data: { isDeleted: true },
  });
};

exports.countSentSince = async ({ userId, otpType, since }, tx = prisma) => {
  return tx.oTP.count({
    where: {
      userId,
      otpType,
      isDeleted: false,
      createdAt: { gte: since },
    },
  });
};

exports.findLatestByUserAndType = async ({ userId, otpType }) => {
  return prisma.oTP.findFirst({
    where: { userId, otpType },
    orderBy: { createdAt: 'desc' },
  });
};
