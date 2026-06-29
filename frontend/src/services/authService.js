import api from './api';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  },

  async forgotPassword(email) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(email, otp, newPassword) {
    const { data } = await api.post('/auth/reset-password', {
      email,
      otp,
      newPassword,
    });
    return data;
  },

  // OTP endpoints
  async resendOtp(email, otpType) {
    const body = { email };
    if (otpType) body.otpType = otpType;
    const { data } = await api.post('/otp/resend-otp', body);
    return data;
  },

  async verifyOtp(email, otp, otpType) {
    const body = { email, otp };
    if (otpType) body.otpType = otpType;
    const { data } = await api.post('/otp/verify-otp', body);
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
