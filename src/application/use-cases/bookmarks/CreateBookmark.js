const bookmarkRepository = require('../../../infrastructure/database/repositories/BookmarkRepository');
const { buildBookmarkPayload } = require('./shared');

class CreateBookmark {
  async execute({ userId, ...input }) {
    const payload = await buildBookmarkPayload(input, userId);

    return bookmarkRepository.create({
      user_id: userId,
      ...payload,
    });
  }
}

module.exports = new CreateBookmark();
