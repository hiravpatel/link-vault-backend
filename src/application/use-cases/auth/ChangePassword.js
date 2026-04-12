const bcrypt = require('bcryptjs');
const userRepository = require('../../../infrastructure/database/repositories/UserRepository');
const { UnauthorizedError, ValidationError } = require('../../../shared/errors');
const { assertStrongPassword } = require('../../../shared/auth/passwords');
const { createRefreshSession, serializeUser } = require('../../../shared/auth/session');

class ChangePassword {
  async execute(userId, { currentPassword, newPassword, confirmPassword }) {
    if (newPassword !== confirmPassword) {
      throw new ValidationError('Passwords do not match');
    }

    assertStrongPassword(newPassword);

    const user = await userRepository.findById(userId).select('+password_hash');
    if (!user) {
      throw new UnauthorizedError('User no longer exists');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedError('Current password is incorrect');
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

module.exports = new ChangePassword();
