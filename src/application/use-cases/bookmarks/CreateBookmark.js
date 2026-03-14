const bookmarkRepository = require('../../../infrastructure/database/repositories/BookmarkRepository');
const tagRepository = require('../../../infrastructure/database/repositories/TagRepository');
const { ValidationError } = require('../../../shared/errors');

class CreateBookmark {
  async execute({ userId, url, title, description, tag_ids = [] }) {
    if (!url) throw new ValidationError('URL is required');
    if (!title) throw new ValidationError('Title is required');

    // Validate tags belong to user
    let validTagIds = [];
    if (tag_ids.length > 0) {
      const tags = await Promise.all(
        tag_ids.map(id => tagRepository.findByIdAndUser(id, userId))
      );
      validTagIds = tags.filter(Boolean).map(t => t._id);
    }

    // Build favicon from hostname
    let favicon_url = null;
    try {
      const urlObj = new URL(url);
      favicon_url = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch (e) { /* invalid URL */ }

    return bookmarkRepository.create({
      user_id: userId,
      url,
      title,
      description: description || null,
      favicon_url,
      tags: validTagIds,
    });
  }
}

module.exports = new CreateBookmark();
