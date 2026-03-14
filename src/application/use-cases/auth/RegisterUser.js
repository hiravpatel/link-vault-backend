const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../../../infrastructure/database/repositories/UserRepository');
const { ConflictError, ValidationError } = require('../../../shared/errors');

class RegisterUser {
  async execute({ name, email, password }) {
    // Check duplicate
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new ConflictError('Email is already registered');

    const password_hash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, password_hash });

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

module.exports = new RegisterUser();
