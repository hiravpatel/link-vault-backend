const { validationResult } = require('express-validator');
const ApiResponse = require('../../shared/ApiResponse');
const { ValidationError } = require('../../shared/errors');
const registerUser = require('../../application/use-cases/auth/RegisterUser');
const loginUser = require('../../application/use-cases/auth/LoginUser');
const refreshSession = require('../../application/use-cases/auth/RefreshSession');
const logoutUser = require('../../application/use-cases/auth/LogoutUser');
const requestPasswordReset = require('../../application/use-cases/auth/RequestPasswordReset');
const resetPassword = require('../../application/use-cases/auth/ResetPassword');
const changePassword = require('../../application/use-cases/auth/ChangePassword');
const { clearRefreshTokenCookie, getRefreshTokenFromRequest, setRefreshTokenCookie } = require('../../shared/http/cookies');

function ensureValid(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array().map(entry => entry.msg));
  }
}

class AuthController {
  async register(req, res, next) {
    try {
      ensureValid(req);
      const result = await registerUser.execute(req.body);
      setRefreshTokenCookie(res, result.refreshToken);
      return ApiResponse.created(res, 'Account created successfully', {
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      ensureValid(req);
      const result = await loginUser.execute(req.body);
      setRefreshTokenCookie(res, result.refreshToken);
      return ApiResponse.success(res, 'Login successful', {
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const result = await refreshSession.execute(getRefreshTokenFromRequest(req));
      setRefreshTokenCookie(res, result.refreshToken);
      return ApiResponse.success(res, 'Session refreshed', {
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      await logoutUser.execute(getRefreshTokenFromRequest(req));
      clearRefreshTokenCookie(res);
      return ApiResponse.success(res, 'Logged out successfully');
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      ensureValid(req);
      const result = await requestPasswordReset.execute(req.body.email);
      return ApiResponse.success(res, 'If an account exists, a reset link has been prepared', result);
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req, res, next) {
    try {
      ensureValid(req);
      const result = await resetPassword.execute(req.body);
      setRefreshTokenCookie(res, result.refreshToken);
      return ApiResponse.success(res, 'Password updated successfully', {
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req, res, next) {
    try {
      ensureValid(req);
      const result = await changePassword.execute(req.user._id, req.body);
      setRefreshTokenCookie(res, result.refreshToken);
      return ApiResponse.success(res, 'Password changed successfully', {
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
