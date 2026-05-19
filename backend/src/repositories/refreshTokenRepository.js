const prisma = require('../lib/prisma');

exports.create = async (
  { userId, tokenId, tokenHash, expiresAt },
  tx = prisma
) => {
  return tx.refreshToken.create({
    data: { userId, tokenId, tokenHash, expiresAt },
  });
};

exports.findActiveByTokenId = async ({ userId, tokenId }) => {
  return prisma.refreshToken.findFirst({
    where: {
      userId,
      tokenId,
      revoked: false,
      expiresAt: { gt: new Date() },
    },
  });
};

exports.revokeById = async (id, tx = prisma) => {
  return tx.refreshToken.update({
    where: { id },
    data: { revoked: true },
  });
};

exports.revokeAllForUser = async (userId) => {
  return prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
};
