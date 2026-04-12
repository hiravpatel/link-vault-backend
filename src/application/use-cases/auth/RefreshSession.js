const userRepository = require('../../../infrastructure/database/repositories/UserRepository');
const { UnauthorizedError } = require('../../../shared/errors');
const { createRefreshSession, hashToken, serializeUser } = require('../../../shared/auth/session');

class RefreshSession {
  async execute(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedError('Session has expired. Please sign in again.');
    }

    const user = await userRepository.findByRefreshTokenHash(hashToken(refreshToken));
    if (!user) {
      throw new UnauthorizedError('Session has expired. Please sign in again.');
    }

    const session = createRefreshSession(user);
    const persistedUser = await userRepository.storeRefreshToken(user._id, {
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

module.exports = new RefreshSession();
