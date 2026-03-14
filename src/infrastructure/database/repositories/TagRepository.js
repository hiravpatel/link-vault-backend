const ITagRepository = require('../../../domain/interfaces/ITagRepository');
const Tag = require('../../database/models/Tag');
const Bookmark = require('../../database/models/Bookmark');

class TagRepository extends ITagRepository {
  async findAllByUser(userId) {
    return Tag.find({ user_id: userId }).sort({ name: 1 });
  }

  async findByIdAndUser(id, userId) {
    return Tag.findOne({ _id: id, user_id: userId });
  }

  async findByNameAndUser(name, userId) {
    return Tag.findOne({ user_id: userId, name });
  }

  async create({ user_id, name }) {
    const tag = new Tag({ user_id, name });
    await tag.save();
    return tag;
  }

  async createMany(tagsData) {
    const created = [];
    for (const { user_id, name } of tagsData) {
      try {
        const tag = new Tag({ user_id, name: name.trim() });
        await tag.save();
        created.push(tag);
      } catch (e) {
        if (e.code !== 11000) throw e; // skip duplicates silently
      }
    }
    return created;
  }

  async deleteById(id) {
    return Tag.deleteOne({ _id: id });
  }

  async getCountsByUser(userId, tagIds) {
    return Bookmark.aggregate([
      { $match: { user_id: userId, tags: { $in: tagIds } } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } }
    ]);
  }

  async removeTagFromBookmarks(userId, tagId) {
    return Bookmark.updateMany(
      { user_id: userId },
      { $pull: { tags: tagId } }
    );
  }
}

module.exports = new TagRepository();
