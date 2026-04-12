const IUserRepository = require('../../../domain/interfaces/IUserRepository');
const User = require('../../database/models/User');

const SENSITIVE_SELECTION = '+password_hash +refresh_token_hash +refresh_token_expires_at +password_reset_token_hash +password_reset_expires_at';

class UserRepository extends IUserRepository {
  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() }).select(SENSITIVE_SELECTION);
  }

  async findById(id) {
    return User.findById(id);
  }

  async findByRefreshTokenHash(refreshTokenHash) {
    return User.findOne({
      refresh_token_hash: refreshTokenHash,
      refresh_token_expires_at: { $gt: new Date() },
    }).select(SENSITIVE_SELECTION);
  }

  async findByPasswordResetTokenHash(passwordResetTokenHash) {
    return User.findOne({
      password_reset_token_hash: passwordResetTokenHash,
      password_reset_expires_at: { $gt: new Date() },
    }).select(SENSITIVE_SELECTION);
  }

  async create({ name, email, password_hash }) {
    const user = new User({ name, email: email.toLowerCase(), password_hash });
    await user.save();
    return User.findById(user._id);
  }

  async update(id, updates) {
    return User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );
  }

  async storeRefreshToken(id, { refreshTokenHash, refreshTokenExpiresAt }) {
    return User.findByIdAndUpdate(
      id,
      {
        $set: {
          refresh_token_hash: refreshTokenHash,
          refresh_token_expires_at: refreshTokenExpiresAt,
          last_login_at: new Date(),
        },
      },
      { new: true }
    );
  }

  async clearRefreshToken(id) {
    return User.findByIdAndUpdate(
      id,
      {
        $set: {
          refresh_token_hash: null,
          refresh_token_expires_at: null,
        },
      },
      { new: true }
    );
  }

  async storePasswordResetToken(id, { passwordResetTokenHash, passwordResetExpiresAt }) {
    return User.findByIdAndUpdate(
      id,
      {
        $set: {
          password_reset_token_hash: passwordResetTokenHash,
          password_reset_expires_at: passwordResetExpiresAt,
        },
      },
      { new: true }
    );
  }

  async updatePassword(id, password_hash) {
    return User.findByIdAndUpdate(
      id,
      {
        $set: {
          password_hash,
          password_changed_at: new Date(),
          password_reset_token_hash: null,
          password_reset_expires_at: null,
          refresh_token_hash: null,
          refresh_token_expires_at: null,
        },
      },
      { new: true }
    );
  }
}

module.exports = new UserRepository();
