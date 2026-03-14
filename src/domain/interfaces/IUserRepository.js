/**
 * IUserRepository - Domain interface contract.
 * Infrastructure layer MUST implement all methods defined here.
 */
class IUserRepository {
  async findByEmail(email) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async create(userData) { throw new Error('Not implemented'); }
  async update(id, updates) { throw new Error('Not implemented'); }
}

module.exports = IUserRepository;
