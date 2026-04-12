const REFRESH_COOKIE_NAME = 'lv_refresh_token';
const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 30);

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map(part => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const separatorIndex = part.indexOf('=');
      if (separatorIndex === -1) return acc;

      const key = part.slice(0, separatorIndex).trim();
      const value = decodeURIComponent(part.slice(separatorIndex + 1).trim());
      acc[key] = value;
      return acc;
    }, {});
}

function getRefreshCookieOptions() {
  const secure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
  const sameSite = process.env.COOKIE_SAME_SITE || (secure ? 'none' : 'lax');

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/api/auth',
    maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  };
}

function setRefreshTokenCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, getRefreshCookieOptions());
}

function clearRefreshTokenCookie(res) {
  const { maxAge, ...options } = getRefreshCookieOptions();
  res.clearCookie(REFRESH_COOKIE_NAME, options);
}

function getRefreshTokenFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[REFRESH_COOKIE_NAME] || null;
}

module.exports = {
  clearRefreshTokenCookie,
  getRefreshCookieOptions,
  getRefreshTokenFromRequest,
  setRefreshTokenCookie,
};
