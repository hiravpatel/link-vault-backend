const userRepository = require('../../../infrastructure/database/repositories/UserRepository');

class GetProfile {
  async execute(userId) {
    return userRepository.findById(userId);
  }
}

module.exports = new GetProfile();
