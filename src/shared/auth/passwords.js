const { ValidationError } = require('../errors');

const PASSWORD_MIN_LENGTH = 8;

function validatePasswordStrength(password) {
  const failures = [];

  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    failures.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
  }
  if (!/[a-z]/.test(password || '')) {
    failures.push('Password must include at least one lowercase letter');
  }
  if (!/[A-Z]/.test(password || '')) {
    failures.push('Password must include at least one uppercase letter');
  }
  if (!/[0-9]/.test(password || '')) {
    failures.push('Password must include at least one number');
  }
  if (!/[^A-Za-z0-9]/.test(password || '')) {
    failures.push('Password must include at least one special character');
  }

  return failures;
}

function assertStrongPassword(password) {
  const failures = validatePasswordStrength(password);
  if (failures.length > 0) {
    throw new ValidationError('Password does not meet security requirements', failures);
  }
}

module.exports = {
  PASSWORD_MIN_LENGTH,
  validatePasswordStrength,
  assertStrongPassword,
};
