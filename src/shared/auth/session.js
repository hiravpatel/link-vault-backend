const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_TTL = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 30);
const RESET_TOKEN_MINUTES = Number(process.env.PASSWORD_RESET_MINUTES || 15);

function signAccessToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role || 'user',
    },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
}

function createOpaqueToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function createRefreshSession(user) {
  const refreshToken = createOpaqueToken();
  const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

  return {
    accessToken: signAccessToken(user),
    refreshToken,
    refreshTokenHash: hashToken(refreshToken),
    refreshTokenExpiresAt,
  };
}

function createPasswordResetToken() {
  const token = createOpaqueToken(32);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_MINUTES * 60 * 1000);

  return {
    token,
    tokenHash: hashToken(token),
    expiresAt,
  };
}

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    display_name: user.display_name,
    avatar: user.avatar,
    profile_setup_done: user.profile_setup_done,
    role: user.role || 'user',
    last_login_at: user.last_login_at || null,
    password_changed_at: user.password_changed_at || null,
  };
}

module.exports = {
  createRefreshSession,
  createPasswordResetToken,
  hashToken,
  serializeUser,
};
