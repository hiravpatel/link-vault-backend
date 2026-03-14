/**
 * Base application error class.
 * All custom errors extend this so the global error handler can identify them.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // distinguishes app errors from programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
