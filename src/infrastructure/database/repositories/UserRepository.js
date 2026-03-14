const IUserRepository = require('../../../domain/interfaces/IUserRepository');
const User = require('../../database/models/User');

class UserRepository extends IUserRepository {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findById(id) {
    return User.findById(id).select('-password_hash');
  }

  async create({ name, email, password_hash }) {
    const user = new User({ name, email, password_hash });
    await user.save();
    return user;
  }

  async update(id, updates) {
    return User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).select('-password_hash');
  }
}

module.exports = new UserRepository();
