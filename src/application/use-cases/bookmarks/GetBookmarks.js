const bookmarkRepository = require('../../../infrastructure/database/repositories/BookmarkRepository');

class GetBookmarks {
  async execute(userId) {
    return bookmarkRepository.findAllByUser(userId);
  }
}

module.exports = new GetBookmarks();
