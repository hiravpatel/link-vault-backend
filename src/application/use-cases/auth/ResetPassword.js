const bcrypt = require('bcryptjs');
const userRepository = require('../../../infrastructure/database/repositories/UserRepository');
const { UnauthorizedError, ValidationError } = require('../../../shared/errors');
const { assertStrongPassword } = require('../../../shared/auth/passwords');
const { createRefreshSession, hashToken, serializeUser } = require('../../../shared/auth/session');

class ResetPassword {
  async execute({ token, newPassword, confirmPassword }) {
    if (!token) {
      throw new ValidationError('Reset token is required');
    }
    if (newPassword !== confirmPassword) {
      throw new ValidationError('Passwords do not match');
    }

    assertStrongPassword(newPassword);

    const user = await userRepository.findByPasswordResetTokenHash(hashToken(token));
    if (!user) {
      throw new UnauthorizedError('Reset link is invalid or has expired');
    }

    const password_hash = await bcrypt.hash(newPassword, 12);
    const updatedUser = await userRepository.updatePassword(user._id, password_hash);

    const session = createRefreshSession(updatedUser);
    const persistedUser = await userRepository.storeRefreshToken(updatedUser._id, {
      refreshTokenHash: session.refreshTokenHash,
      refreshTokenExpiresAt: session.refreshTokenExpiresAt,
    });

    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: serializeUser(persistedUser),
    };
  }
}

module.exports = new ResetPassword();
