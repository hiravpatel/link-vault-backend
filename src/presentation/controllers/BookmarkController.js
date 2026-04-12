const { validationResult } = require('express-validator');
const ApiResponse = require('../../shared/ApiResponse');
const { ValidationError } = require('../../shared/errors');
const getBookmarks = require('../../application/use-cases/bookmarks/GetBookmarks');
const createBookmark = require('../../application/use-cases/bookmarks/CreateBookmark');
const updateBookmark = require('../../application/use-cases/bookmarks/UpdateBookmark');
const deleteBookmark = require('../../application/use-cases/bookmarks/DeleteBookmark');

function ensureValid(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array().map(entry => entry.msg));
  }
}

class BookmarkController {
  async getAll(req, res, next) {
    try {
      const result = await getBookmarks.execute(req.user._id, {
        q: req.query.q,
        type: req.query.type,
        category: req.query.category,
        tagId: req.query.tagId,
        from: req.query.from,
        to: req.query.to,
        sort: req.query.sort,
        page: req.query.page,
        limit: req.query.limit,
      });

      return ApiResponse.success(res, 'Bookmarks fetched', result.items, 200, result.meta);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      ensureValid(req);
      const bookmark = await createBookmark.execute({
        userId: req.user._id,
        ...req.body,
      });
      return ApiResponse.created(res, 'Bookmark saved', bookmark);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      ensureValid(req);
      const bookmark = await updateBookmark.execute(req.params.id, req.user._id, req.body);
      return ApiResponse.success(res, 'Bookmark updated', bookmark);
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      await deleteBookmark.execute(req.params.id, req.user._id);
      return ApiResponse.success(res, 'Bookmark deleted');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BookmarkController();
