const IBookmarkRepository = require('../../../domain/interfaces/IBookmarkRepository');
const Bookmark = require('../../database/models/Bookmark');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildQuery(userId, filters = {}) {
  const query = { user_id: userId };

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.category) {
    query.category = { $regex: new RegExp(`^${escapeRegex(filters.category.trim())}$`, 'i') };
  }

  if (filters.tagId) {
    query.tags = filters.tagId;
  }

  if (filters.from || filters.to) {
    query.created_at = {};
    if (filters.from) query.created_at.$gte = new Date(filters.from);
    if (filters.to) query.created_at.$lte = new Date(filters.to);
  }

  if (filters.q) {
    const regex = new RegExp(escapeRegex(filters.q.trim()), 'i');
    query.$or = [
      { title: regex },
      { url: regex },
      { description: regex },
      { content: regex },
      { category: regex },
    ];
  }

  return query;
}

function buildSort(sort = 'newest') {
  if (sort === 'oldest') return { created_at: 1 };
  if (sort === 'updated') return { updated_at: -1 };
  return { created_at: -1 };
}

class BookmarkRepository extends IBookmarkRepository {
  async findAllByUser(userId, filters = {}) {
    const page = Math.max(Number(filters.page) || 1, 1);
    const limit = Math.min(Math.max(Number(filters.limit) || 24, 1), 100);
    const skip = (page - 1) * limit;
    const query = buildQuery(userId, filters);
    const sort = buildSort(filters.sort);

    const [items, total, categories] = await Promise.all([
      Bookmark.find(query)
        .populate('tags', 'name _id')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Bookmark.countDocuments(query),
      Bookmark.distinct('category', { user_id: userId, category: { $nin: [null, ''] } }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        categories: categories.filter(Boolean).sort((a, b) => a.localeCompare(b)),
      },
    };
  }

  async findByIdAndUser(id, userId) {
    return Bookmark.findOne({ _id: id, user_id: userId }).populate('tags', 'name _id');
  }

  async create(payload) {
    const bookmark = new Bookmark(payload);
    await bookmark.save();
    await bookmark.populate('tags', 'name _id');
    return bookmark.toObject();
  }

  async updateByIdAndUser(id, userId, payload) {
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: id, user_id: userId },
      { $set: payload },
      { new: true }
    ).populate('tags', 'name _id');

    return bookmark ? bookmark.toObject() : null;
  }

  async deleteById(id) {
    return Bookmark.deleteOne({ _id: id });
  }
}

module.exports = new BookmarkRepository();
