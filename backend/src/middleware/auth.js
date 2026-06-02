const jwt = require('jsonwebtoken');
const config = require('../config');

exports.requireAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, config.jwt.accessSecret);
    req.user = { 
      id: payload.sub, 
      email: payload.email,
      roles: payload.roles || []
    };
    return next();
    // eslint-disable-next-line no-unused-vars, no-empty
  } catch (err) {
    // Invalid or expired token
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

exports.requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    next();
  };
};
