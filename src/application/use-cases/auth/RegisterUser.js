const bcrypt = require('bcryptjs');
const userRepository = require('../../../infrastructure/database/repositories/UserRepository');
const { ConflictError } = require('../../../shared/errors');
const { assertStrongPassword } = require('../../../shared/auth/passwords');
const { createRefreshSession, serializeUser } = require('../../../shared/auth/session');

class RegisterUser {
  async execute({ name, email, password }) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const existing = await userRepository.findByEmail(normalizedEmail);
    if (existing) throw new ConflictError('Email is already registered');

    assertStrongPassword(password);

    const password_hash = await bcrypt.hash(password, 12);
    const user = await userRepository.create({ name: name.trim(), email: normalizedEmail, password_hash });

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

module.exports = new RegisterUser();
