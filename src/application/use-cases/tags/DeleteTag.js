const tagRepository = require('../../../infrastructure/database/repositories/TagRepository');
const { NotFoundError } = require('../../../shared/errors');

class DeleteTag {
  async execute(tagId, userId) {
    const tag = await tagRepository.findByIdAndUser(tagId, userId);
    if (!tag) throw new NotFoundError('Tag');

    // Cascading remove tag from all bookmarks
    await tagRepository.removeTagFromBookmarks(userId, tag._id);
    await tagRepository.deleteById(tagId);

    return { id: tagId };
  }
}

module.exports = new DeleteTag();
