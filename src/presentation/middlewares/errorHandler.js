const AppError = require('../../shared/errors/AppError');
const ApiResponse = require('../../shared/ApiResponse');

/**
 * Global error handler middleware.
 * Catches all errors forwarded via next(err).
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log for debugging (swap with a logger in production)
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[${new Date().toISOString()}] ${err.name || 'Error'}: ${err.message}`);
    if (!err.isOperational) console.error(err.stack);
  }

  // Operational / known errors (AppError subclasses)
  if (err.isOperational) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors || []);
  }

  // Mongoose duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return ApiResponse.error(res, `Duplicate value for ${field}`, 409);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return ApiResponse.error(res, `Invalid ${err.path}: ${err.value}`, 400);
  }

  // JSON Web Token errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 'Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 'Token expired, please log in again', 401);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return ApiResponse.error(res, 'Validation failed', 400, messages);
  }

  // Unknown / programming errors — don't leak details
  return ApiResponse.error(res, 'Internal server error', 500);
};

module.exports = errorHandler;
