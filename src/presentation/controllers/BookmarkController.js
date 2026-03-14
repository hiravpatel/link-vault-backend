const { validationResult } = require('express-validator');
const ApiResponse = require('../../shared/ApiResponse');
const { ValidationError } = require('../../shared/errors');
const getBookmarks = require('../../application/use-cases/bookmarks/GetBookmarks');
const createBookmark = require('../../application/use-cases/bookmarks/CreateBookmark');
const deleteBookmark = require('../../application/use-cases/bookmarks/DeleteBookmark');

class BookmarkController {
  async getAll(req, res, next) {
    try {
      const bookmarks = await getBookmarks.execute(req.user._id);
      return ApiResponse.success(res, 'Bookmarks fetched', bookmarks);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array().map(e => e.msg));
      }
      const bookmark = await createBookmark.execute({
        userId: req.user._id,
        ...req.body,
      });
      return ApiResponse.created(res, 'Bookmark saved', bookmark);
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
