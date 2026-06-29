const ApiError = require('../utils/ApiError');
const config = require('../config');

const RESEND_BASE_URL = 'https://api.resend.com';

const isResendConfigured = () => Boolean(config.resend.apiKey);

const sendMail = async (payload) => {
  if (!isResendConfigured()) {
    throw new ApiError(503, 'Email service is not configured');
  }

  const response = await fetch(`${RESEND_BASE_URL}/emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resend.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(502, 'Failed to send email', {
      status: response.status,
      body,
    });
  }

  return response.json();
};

module.exports = {
  isResendConfigured,
  sendMail,
};
