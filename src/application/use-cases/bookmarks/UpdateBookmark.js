const bookmarkRepository = require('../../../infrastructure/database/repositories/BookmarkRepository');
const { NotFoundError } = require('../../../shared/errors');
const { buildBookmarkPayload } = require('./shared');

class UpdateBookmark {
  async execute(bookmarkId, userId, input) {
    const existing = await bookmarkRepository.findByIdAndUser(bookmarkId, userId);
    if (!existing) {
      throw new NotFoundError('Bookmark');
    }

    const mergedInput = {
      type: input.type ?? existing.type,
      title: input.title ?? existing.title,
      url: input.url ?? existing.url,
      description: input.description ?? existing.description,
      content: input.content ?? existing.content,
      category: input.category ?? existing.category,
      tag_ids: input.tag_ids ?? existing.tags.map(tag => tag._id.toString()),
    };

    const payload = await buildBookmarkPayload(mergedInput, userId, { partial: true });
    const updated = await bookmarkRepository.updateByIdAndUser(bookmarkId, userId, payload);

    if (!updated) {
      throw new NotFoundError('Bookmark');
    }

    return updated;
  }
}

module.exports = new UpdateBookmark();
