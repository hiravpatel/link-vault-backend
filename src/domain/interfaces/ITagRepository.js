class ITagRepository {
  async findAllByUser(userId) { throw new Error('Not implemented'); }
  async findByIdAndUser(id, userId) { throw new Error('Not implemented'); }
  async findByNameAndUser(name, userId) { throw new Error('Not implemented'); }
  async create(tagData) { throw new Error('Not implemented'); }
  async createMany(tagsData) { throw new Error('Not implemented'); }
  async deleteById(id) { throw new Error('Not implemented'); }
  async getCountsByUser(userId, tagIds) { throw new Error('Not implemented'); }
  async removeTagFromBookmarks(userId, tagId) { throw new Error('Not implemented'); }
}

module.exports = ITagRepository;
