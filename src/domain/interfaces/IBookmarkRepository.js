class IBookmarkRepository {
  async findAllByUser(userId) { throw new Error('Not implemented'); }
  async findByIdAndUser(id, userId) { throw new Error('Not implemented'); }
  async create(bookmarkData) { throw new Error('Not implemented'); }
  async deleteById(id) { throw new Error('Not implemented'); }
}

module.exports = IBookmarkRepository;
