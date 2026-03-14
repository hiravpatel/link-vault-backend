const { validationResult } = require('express-validator');
const ApiResponse = require('../../shared/ApiResponse');
const { ValidationError } = require('../../shared/errors');
const registerUser = require('../../application/use-cases/auth/RegisterUser');
const loginUser = require('../../application/use-cases/auth/LoginUser');

class AuthController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array().map(e => e.msg));
      }
      const result = await registerUser.execute(req.body);
      return ApiResponse.created(res, 'Account created successfully', result);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array().map(e => e.msg));
      }
      const result = await loginUser.execute(req.body);
      return ApiResponse.success(res, 'Login successful', result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
