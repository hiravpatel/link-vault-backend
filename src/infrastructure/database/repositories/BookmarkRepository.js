const IBookmarkRepository = require('../../../domain/interfaces/IBookmarkRepository');
const Bookmark = require('../../database/models/Bookmark');

class BookmarkRepository extends IBookmarkRepository {
  async findAllByUser(userId) {
    return Bookmark.find({ user_id: userId })
      .populate('tags', 'name _id')
      .sort({ created_at: -1 });
  }

  async findByIdAndUser(id, userId) {
    return Bookmark.findOne({ _id: id, user_id: userId });
  }

  async create({ user_id, url, title, description, favicon_url, tags }) {
    const bookmark = new Bookmark({ user_id, url, title, description, favicon_url, tags });
    await bookmark.save();
    await bookmark.populate('tags', 'name _id');
    return bookmark;
  }

  async deleteById(id) {
    return Bookmark.deleteOne({ _id: id });
  }
}

module.exports = new BookmarkRepository();
