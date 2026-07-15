const userRepo = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');

module.exports = async function requireVerified(req, res, next) {
  if (!req.user || !req.user.id)
    return res.status(401).json({ message: 'Unauthorized' });
  try {
    const user = await userRepo.findById(req.user.id);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (!user.isVerified) {
      // 403 Forbidden - user must verify email
      return res
        .status(403)
        .json({
          message: 'Email not verified. Please verify your email to continue.',
        });
    }
    // attach full user
    req.user = { ...req.user, isVerified: true };
    return next();
  } catch (err) {
    return next(err);
  }
};
