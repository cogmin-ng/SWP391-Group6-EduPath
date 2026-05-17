const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const userRepo = require('../repositories/userRepository');
const refreshTokenRepo = require('../repositories/refreshTokenRepository');
const config = require('../config');
const ApiError = require('../utils/ApiError');
const { auth: authMessages } = require('../constants/messages');
const prisma = require('../lib/prisma');

const createAccessToken = (user) => {
  return jwt.sign(
    { sub: user.id, email: user.email },
    config.jwt.accessSecret,
    { expiresIn: '15m' }
  );
};

const createRefreshToken = (user, tokenId) => {
  return jwt.sign({ sub: user.id, jti: tokenId }, config.jwt.refreshSecret, {
    expiresIn: '7d',
  });
};

const refreshTokenExpiresAt = () => {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
};

exports.register = async ({ email, password }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new ApiError(400, authMessages.emailAlreadyInUse);
  const hash = await bcrypt.hash(password, 10);
  const user = await userRepo.create({ email, passwordHash: hash });
  return user;
};

exports.login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new ApiError(401, authMessages.invalidCredentials);
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, authMessages.invalidCredentials);
  const accessToken = createAccessToken(user);
  const tokenId = randomUUID();
  const refreshToken = createRefreshToken(user, tokenId);
  const tokenHash = await bcrypt.hash(refreshToken, 10);
  await refreshTokenRepo.create({
    userId: user.id,
    tokenId,
    tokenHash,
    expiresAt: refreshTokenExpiresAt(),
  });
  return { accessToken, refreshToken };
};

exports.refresh = async ({ refreshToken }) => {
  try {
    const payload = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const userId = payload.sub;
    const tokenId = payload.jti;
    if (!tokenId) throw new ApiError(401, authMessages.invalidRefreshToken);

    const existingToken = await refreshTokenRepo.findActiveByTokenId({
      userId,
      tokenId,
    });
    if (!existingToken)
      throw new ApiError(401, authMessages.refreshTokenRevoked);

    const match = await bcrypt.compare(refreshToken, existingToken.tokenHash);
    if (!match) throw new ApiError(401, authMessages.invalidRefreshToken);

    if (new Date(existingToken.expiresAt) < new Date())
      throw new ApiError(401, authMessages.refreshTokenExpired);

    const user = await userRepo.findById(userId);
    if (!user) throw new ApiError(404, authMessages.userNotFound);

    const newTokenId = randomUUID();
    const newRefreshToken = createRefreshToken(user, newTokenId);
    const newTokenHash = await bcrypt.hash(newRefreshToken, 10);

    await prisma.$transaction(async (tx) => {
      await refreshTokenRepo.revokeById(existingToken.id, tx);
      await refreshTokenRepo.create(
        {
          userId: user.id,
          tokenId: newTokenId,
          tokenHash: newTokenHash,
          expiresAt: refreshTokenExpiresAt(),
        },
        tx
      );
    });

    const accessToken = createAccessToken(user);
    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(401, authMessages.invalidRefreshToken);
  }
};

exports.logout = async ({ refreshToken }) => {
  try {
    const payload = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const userId = payload.sub;
    const tokenId = payload.jti;
    if (!tokenId) return;

    const existingToken = await refreshTokenRepo.findActiveByTokenId({
      userId,
      tokenId,
    });
    if (!existingToken) return;

    const match = await bcrypt.compare(refreshToken, existingToken.tokenHash);
    if (!match) return;

    await refreshTokenRepo.revokeById(existingToken.id);
    return;
  } catch (err) {
    return;
  }
};
