const { TooManyRequestsError } = require('../../shared/errors');

function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 10 } = {}) {
  const buckets = new Map();

  return (req, res, next) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    const timestamps = (buckets.get(key) || []).filter(timestamp => timestamp > windowStart);

    if (timestamps.length >= max) {
      return next(new TooManyRequestsError('Too many requests. Please try again in a few minutes.'));
    }

    timestamps.push(now);
    buckets.set(key, timestamps);
    next();
  };
}

module.exports = createRateLimiter;
