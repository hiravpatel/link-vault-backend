const userRepository = require('../../../infrastructure/database/repositories/UserRepository');
const { hashToken } = require('../../../shared/auth/session');

class LogoutUser {
  async execute(refreshToken) {
    if (!refreshToken) {
      return { success: true };
    }

    const user = await userRepository.findByRefreshTokenHash(hashToken(refreshToken));
    if (user) {
      await userRepository.clearRefreshToken(user._id);
    }

    return { success: true };
  }
}

module.exports = new LogoutUser();
