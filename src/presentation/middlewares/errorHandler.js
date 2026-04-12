const ApiResponse = require('../../shared/ApiResponse');
const logger = require('../../shared/utils/logger');

function mapErrorCode(err) {
  if (err.name === 'ValidationError') return 'VALIDATION_ERROR';
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') return 'AUTH_ERROR';
  if (err.name === 'ForbiddenError') return 'FORBIDDEN';
  if (err.name === 'NotFoundError') return 'NOT_FOUND';
  if (err.name === 'ConflictError') return 'CONFLICT';
  if (err.name === 'TooManyRequestsError') return 'RATE_LIMITED';
  return 'INTERNAL_ERROR';
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error('request.failed', {
    requestId: req.requestId || null,
    method: req.method,
    path: req.originalUrl,
    statusCode: err.statusCode || 500,
    errorName: err.name || 'Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  if (err.isOperational) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors || [], mapErrorCode(err));
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return ApiResponse.error(res, `Duplicate value for ${field}`, 409, [], 'CONFLICT');
  }

  if (err.name === 'CastError') {
    return ApiResponse.error(res, `Invalid ${err.path}: ${err.value}`, 400, [], 'VALIDATION_ERROR');
  }

  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 'Invalid token', 401, [], 'AUTH_ERROR');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 'Token expired, please log in again', 401, [], 'AUTH_ERROR');
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map(entry => entry.message);
    return ApiResponse.error(res, 'Validation failed', 400, messages, 'VALIDATION_ERROR');
  }

  return ApiResponse.error(res, 'Internal server error', 500, [], 'INTERNAL_ERROR');
};

module.exports = errorHandler;
