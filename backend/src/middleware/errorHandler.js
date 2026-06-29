const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  void next;
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  // Normalize JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token';
  }

  // Normalize Prisma known errors without leaking internals
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Resource already exists';
    details = { target: err.meta?.target || null };
  }

  if (statusCode >= 500) {
    logger.error(
      {
        err: {
          name: err.name,
          message: err.message,
          code: err.code,
        },
        request: {
          method: req.method,
          path: req.originalUrl,
          ip: req.ip,
        },
      },
      'Unhandled server error'
    );
    message = 'Internal Server Error';
  } else {
    logger.warn(
      {
        statusCode,
        error: err.message,
        request: {
          method: req.method,
          path: req.originalUrl,
          ip: req.ip,
        },
      },
      'Handled request error'
    );
  }

  const payload = {
    success: false,
    // Surface the actual error message for client when it's a handled error
    message,
    error: {
      message,
      ...(details ? { details } : {}),
    },
  };

  res.status(statusCode).json(payload);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
