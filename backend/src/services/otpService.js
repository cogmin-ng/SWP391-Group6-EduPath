const bcrypt = require('bcryptjs');
const { randomInt, randomUUID } = require('node:crypto');
const userRepo = require('../repositories/userRepository');
const otpRepo = require('../repositories/otpRepository');
const resendService = require('./externalService/resend/resendService');
const ApiError = require('../utils/ApiError');
const { otp: otpMessages } = require('../constants/messages');

const OTP_EXPIRE_MINUTES = 10;
// OTP default is for password reset. Email verification uses a signed link flow.
const OTP_TYPE_DEFAULT = 'RESET_PASSWORD';
const OTP_LENGTH = 6;
const BCRYPT_SALT_ROUNDS = 10;
// resend limits
const RESEND_MIN_SECONDS = 60; // minimum seconds between resends
const RESEND_MAX_PER_WINDOW = 6; // max resends per window
const RESEND_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

const generateOtpCode = () => {
  return String(randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, '0');
};

const createOtp = async ({ userId, otpType }) => {
  const code = generateOtpCode();
  const codeHash = await bcrypt.hash(code, BCRYPT_SALT_ROUNDS);
  const expiredAt = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);

  await otpRepo.markActiveAsDeletedForUserAndType({ userId, otpType });
  await otpRepo.create({ userId, codeHash, otpType, expiredAt });

  return code;
};

exports.sendOtp = async ({ email, otpType = OTP_TYPE_DEFAULT }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new ApiError(404, otpMessages.userNotFound);
  }

  if (otpType === 'VERIFY_EMAIL' && user.isVerified) {
    throw new ApiError(400, 'Email đã được xác thực trước đó.');
  }

  const since = new Date(Date.now() - RESEND_WINDOW_MS);
  const sentCount = await otpRepo.countCreatedSince({
    userId: user.id,
    otpType,
    since,
  });
  if (sentCount >= RESEND_MAX_PER_WINDOW) {
    throw new ApiError(429, 'Gửi mã quá nhiều lần. Vui lòng thử lại sau.');
  }

  const last = await otpRepo.findLatestByUserAndType({
    userId: user.id,
    otpType,
  });
  if (last && last.createdAt) {
    const delta = Date.now() - new Date(last.createdAt).getTime();
    if (delta < RESEND_MIN_SECONDS * 1000) {
      const wait = Math.ceil((RESEND_MIN_SECONDS * 1000 - delta) / 1000);
      throw new ApiError(
        429,
        `Vui lòng đợi ${wait} giây trước khi yêu cầu lại mã.`
      );
    }
  }

  const code = await createOtp({ userId: user.id, otpType });
  await resendService.sendOtpEmail({
    email: user.email,
    otp: code,
    expiresInMinutes: OTP_EXPIRE_MINUTES,
    purpose: otpType,
  });

  return { email: user.email };
};

exports.resendOtp = async ({ email, otpType = OTP_TYPE_DEFAULT }) => {
  return this.sendOtp({ email, otpType });
};

exports.verifyOtp = async ({ email, otp, otpType = OTP_TYPE_DEFAULT }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new ApiError(404, otpMessages.userNotFound);
  }

  const record = await otpRepo.findLatestActiveByUserAndType({
    userId: user.id,
    otpType,
  });

  if (!record) {
    throw new ApiError(401, otpMessages.invalidOrExpiredOtp);
  }

  if (new Date(record.expiredAt) < new Date()) {
    await otpRepo.consumeById(record.id);
    throw new ApiError(401, otpMessages.invalidOrExpiredOtp);
  }

  const isValid = await bcrypt.compare(otp, record.code);
  if (!isValid) {
    throw new ApiError(401, otpMessages.invalidOrExpiredOtp);
  }

  await otpRepo.consumeById(record.id);

  // If this OTP was for email verification, mark the user as verified
  if (otpType === 'VERIFY_EMAIL') {
    await userRepo.markVerified(user.id);
  }

  return { verified: true };
};

// Verification via OTP only. Link-based verification removed.
