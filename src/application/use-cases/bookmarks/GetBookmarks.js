const bookmarkRepository = require('../../../infrastructure/database/repositories/BookmarkRepository');

class GetBookmarks {
  async execute(userId, filters = {}) {
    return bookmarkRepository.findAllByUser(userId, filters);
  }
}

module.exports = new GetBookmarks();
