/**
 * Standardised API response shape:
 *
 * Success: { success: true,  message, data }
 * Error:   { success: false, message, errors? }
 */
class ApiResponse {
  /**
   * @param {import('express').Response} res
   * @param {number} statusCode
   * @param {string} message
   * @param {*} data
   */
  static success(res, message = 'Success', data = null, statusCode = 200, meta = null) {
    const body = {
      success: true,
      message,
      requestId: res.locals.requestId || null,
      timestamp: new Date().toISOString(),
    };
    if (data !== null && data !== undefined) body.data = data;
    if (meta) body.meta = meta;
    return res.status(statusCode).json(body);
  }

  /**
   * @param {import('express').Response} res
   * @param {number} statusCode
   * @param {string} message
   * @param {Array} errors
   */
  static error(res, message = 'Something went wrong', statusCode = 500, errors = [], code = 'INTERNAL_ERROR') {
    const body = {
      success: false,
      message,
      code,
      requestId: res.locals.requestId || null,
      timestamp: new Date().toISOString(),
    };
    if (errors.length > 0) {
      body.errors = errors;
      body.details = errors;
    }
    return res.status(statusCode).json(body);
  }

  static created(res, message, data) {
    return ApiResponse.success(res, message, data, 201);
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
