const jwt = require('jsonwebtoken');
const userRepository = require('../../infrastructure/database/repositories/UserRepository');
const { UnauthorizedError } = require('../../shared/errors');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userRepository.findById(decoded.userId);
    if (!user) throw new UnauthorizedError('User no longer exists');

    req.user = user;
    next();
  } catch (err) {
    next(err); // forward to global error handler
  }
};

module.exports = authenticate;
