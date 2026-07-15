const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('node:crypto');
const userRepo = require('../repositories/userRepository');
const roleRepo = require('../repositories/roleRepository');
const refreshTokenRepo = require('../repositories/refreshTokenRepository');
const otpService = require('./otpService');
const config = require('../config');
const ApiError = require('../utils/ApiError');
const { auth: authMessages } = require('../constants/messages');
const prisma = require('../lib/prisma');
const ROLES = require('../constants/roles');

const createAccessToken = (user, roles) => {
  return jwt.sign(
    { sub: user.id, email: user.email, roles },
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

const getUserRoles = async (userId) => {
  const userWithRole = await userRepo.findByIdWithRole(userId);
  if (!userWithRole || !userWithRole.role) return [];
  return [userWithRole.role.name];
};

const getDefaultRole = async () => {
  const defaultRoleName = ROLES.MENTEE;
  let defaultRole = await roleRepo.findByName(defaultRoleName);
  if (!defaultRole) {
    defaultRole = await roleRepo.create({ name: defaultRoleName });
  }
  return defaultRole;
};

const buildAuthUser = (user, roles) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  avatarUrl: user.avatar,
  roles,
});

exports.register = async ({ email, password, name }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new ApiError(400, authMessages.emailAlreadyInUse);

  const hash = await bcrypt.hash(password, 10);
  const defaultRole = await getDefaultRole();

  const user = await userRepo.create({
    email,
    passwordHash: hash,
    name,
    roleId: defaultRole.id,
  });

  try {
    const otpService = require('./otpService');
    await otpService.sendOtp({ email: user.email, otpType: 'VERIFY_EMAIL' });
  } catch (err) {
    console.error('Failed to send verification email', err.message || err);
  }

  return user;
};

exports.forgotPassword = async ({ email }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    // Avoid leaking whether the email exists.
    return { email };
  }

  try {
    const otpService = require('./otpService');
    await otpService.sendOtp({ email: user.email, otpType: 'RESET_PASSWORD' });
  } catch (err) {
    console.error('Failed to send password reset email', err.message || err);
  }

  return { email: user.email };
};

exports.resetPassword = async ({ email, otp, newPassword }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new ApiError(400, 'Invalid password reset request');
  }

  await otpService.verifyOtp({ email, otp, otpType: 'RESET_PASSWORD' });
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await userRepo.update(user.id, { passwordHash });
  await refreshTokenRepo.revokeAllForUser(user.id);
  return { email: user.email };
};

exports.login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new ApiError(401, authMessages.invalidCredentials);
  if (!user.isVerified)
    throw new ApiError(
      403,
      'Email not verified. Please verify your email to continue.'
    );
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, authMessages.invalidCredentials);

  const roles = await getUserRoles(user.id);

  if (user.status === 'INACTIVE' && !roles.includes('ADMIN')) {
    throw new ApiError(403, 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.');
  }

  const accessToken = createAccessToken(user, roles);
  const tokenId = randomUUID();
  const refreshToken = createRefreshToken(user, tokenId);
  const tokenHash = await bcrypt.hash(refreshToken, 10);
  await refreshTokenRepo.create({
    userId: user.id,
    tokenId,
    tokenHash,
    expiresAt: refreshTokenExpiresAt(),
  });
  return {
    accessToken,
    refreshToken,
    user: buildAuthUser(user, roles),
  };
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

    const roles = await getUserRoles(user.id);
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

    const accessToken = createAccessToken(user, roles);
    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: buildAuthUser(user, roles),
    };
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
    // eslint-disable-next-line no-unused-vars, no-empty
  } catch (err) {
    // Silently ignore JWT verification errors for logout
    return;
  }
};

exports.getMe = async (userId) => {
  const user = await userRepo.findByIdWithRole(userId);
  if (!user) throw new ApiError(404, authMessages.userNotFound);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    xp: user.xp,
    roles: await getUserRoles(user.id),
  };
};
