const { validationResult } = require('express-validator');
const ApiResponse = require('../../shared/ApiResponse');
const { ValidationError } = require('../../shared/errors');
const getTags = require('../../application/use-cases/tags/GetTags');
const createTag = require('../../application/use-cases/tags/CreateTag');
const createBulkTags = require('../../application/use-cases/tags/CreateBulkTags');
const deleteTag = require('../../application/use-cases/tags/DeleteTag');

class TagController {
  async getAll(req, res, next) {
    try {
      const tags = await getTags.execute(req.user._id);
      return ApiResponse.success(res, 'Tags fetched', tags);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const tag = await createTag.execute({ userId: req.user._id, name: req.body.name });
      return ApiResponse.created(res, 'Tag created', tag);
    } catch (err) {
      next(err);
    }
  }

  async createBulk(req, res, next) {
    try {
      const tags = await createBulkTags.execute({ userId: req.user._id, names: req.body.names });
      return ApiResponse.created(res, 'Tags created', tags);
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      await deleteTag.execute(req.params.id, req.user._id);
      return ApiResponse.success(res, 'Tag deleted');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TagController();
