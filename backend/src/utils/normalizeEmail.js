module.exports = function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : email;
};
