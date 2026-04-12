const userRepository = require('../../../infrastructure/database/repositories/UserRepository');
const { createPasswordResetToken } = require('../../../shared/auth/session');

class RequestPasswordReset {
  async execute(email) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      return { emailSent: true };
    }

    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user) {
      return { emailSent: true };
    }

    const resetToken = createPasswordResetToken();
    await userRepository.storePasswordResetToken(user._id, {
      passwordResetTokenHash: resetToken.tokenHash,
      passwordResetExpiresAt: resetToken.expiresAt,
    });

    return {
      emailSent: true,
      resetToken: process.env.NODE_ENV === 'production' ? undefined : resetToken.token,
      expiresAt: resetToken.expiresAt,
    };
  }
}

module.exports = new RequestPasswordReset();
