const bookmarkRepository = require('../../../infrastructure/database/repositories/BookmarkRepository');
const { NotFoundError } = require('../../../shared/errors');

class DeleteBookmark {
  async execute(bookmarkId, userId) {
    const bookmark = await bookmarkRepository.findByIdAndUser(bookmarkId, userId);
    if (!bookmark) throw new NotFoundError('Bookmark');
    await bookmarkRepository.deleteById(bookmarkId);
    return { id: bookmarkId };
  }
}

module.exports = new DeleteBookmark();
