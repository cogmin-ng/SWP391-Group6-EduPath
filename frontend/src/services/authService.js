import api from './api';

const publicRequestConfig = { skipAuth: true };

export const authService = {
  async login(email, password) {
    const { data } = await api.post(
      '/auth/login',
      { email, password },
      publicRequestConfig
    );
    return data;
  },

  async register(name, email, password) {
    const { data } = await api.post(
      '/auth/register',
      { name, email, password },
      publicRequestConfig
    );
    return data;
  },

  async forgotPassword(email) {
    const { data } = await api.post(
      '/auth/forgot-password',
      { email },
      publicRequestConfig
    );
    return data;
  },

  async resetPassword(email, otp, newPassword) {
    const { data } = await api.post(
      '/auth/reset-password',
      {
        email,
        otp,
        newPassword,
      },
      publicRequestConfig
    );
    return data;
  },

  // OTP endpoints
  async resendOtp(email, otpType) {
    const body = { email };
    if (otpType) body.otpType = otpType;
    const { data } = await api.post(
      '/otp/resend-otp',
      body,
      publicRequestConfig
    );
    return data;
  },

  async verifyOtp(email, otp, otpType) {
    const body = { email, otp };
    if (otpType) body.otpType = otpType;
    const { data } = await api.post(
      '/otp/verify-otp',
      body,
      publicRequestConfig
    );
    return data;
  },

  async logout(refreshToken) {
    const { data } = await api.post('/auth/logout', { refreshToken });
    return data;
  },

  async refresh(refreshToken) {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data;
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
