const IBookmarkRepository = require('../../../domain/interfaces/IBookmarkRepository');
const Bookmark = require('../../database/models/Bookmark');
const encryptionService = require('../../../shared/utils/EncryptionService');

class BookmarkRepository extends IBookmarkRepository {
  /**
   * Helper to decrypt bookmark fields
   */
  _decryptBookmark(bookmark) {
    if (!bookmark) return bookmark;
    
    // Handle both mongoose objects and lean objects
    const b = bookmark.toObject ? bookmark.toObject() : bookmark;
    
    return {
      ...b,
      url: encryptionService.decrypt(b.url),
      title: encryptionService.decrypt(b.title),
      description: encryptionService.decrypt(b.description)
    };
  }

  async findAllByUser(userId) {
    const bookmarks = await Bookmark.find({ user_id: userId })
      .populate('tags', 'name _id')
      .sort({ created_at: -1 });
    
    return bookmarks.map(this._decryptBookmark);
  }

  async findByIdAndUser(id, userId) {
    const bookmark = await Bookmark.findOne({ _id: id, user_id: userId });
    return this._decryptBookmark(bookmark);
  }

  async create({ user_id, url, title, description, favicon_url, tags }) {
    const bookmark = new Bookmark({ 
      user_id, 
      url: encryptionService.encrypt(url), 
      title: encryptionService.encrypt(title), 
      description: encryptionService.encrypt(description), 
      favicon_url, 
      tags 
    });
    
    await bookmark.save();
    await bookmark.populate('tags', 'name _id');
    
    return this._decryptBookmark(bookmark);
  }

  async deleteById(id) {
    return Bookmark.deleteOne({ _id: id });
  }
}

module.exports = new BookmarkRepository();
