const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../../../infrastructure/database/repositories/UserRepository');
const { UnauthorizedError } = require('../../../shared/errors');

class LoginUser {
  async execute({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new UnauthorizedError('Invalid email or password');

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        display_name: user.display_name,
        avatar: user.avatar,
        profile_setup_done: user.profile_setup_done,
      },
    };
  }
}

module.exports = new LoginUser();
