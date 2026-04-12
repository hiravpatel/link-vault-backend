const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/AuthController');
const authenticate = require('../middlewares/authenticate');
const createRateLimiter = require('../middlewares/rateLimit');

const router = express.Router();
const authLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 8 });

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
  ],
  authController.register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

router.post(
  '/forgot-password',
  authLimiter,
  [body('email').isEmail().withMessage('Valid email is required')],
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authLimiter,
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isString().notEmpty().withMessage('New password is required'),
    body('confirmPassword').isString().notEmpty().withMessage('Confirm password is required'),
  ],
  authController.resetPassword
);

router.post(
  '/change-password',
  authenticate,
  authLimiter,
  [
    body('currentPassword').isString().notEmpty().withMessage('Current password is required'),
    body('newPassword').isString().notEmpty().withMessage('New password is required'),
    body('confirmPassword').isString().notEmpty().withMessage('Confirm password is required'),
  ],
  authController.changePassword
);

module.exports = router;
