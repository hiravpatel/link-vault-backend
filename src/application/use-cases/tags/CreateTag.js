const tagRepository = require('../../../infrastructure/database/repositories/TagRepository');
const { ConflictError, ValidationError } = require('../../../shared/errors');

class CreateTag {
  async execute({ userId, name }) {
    if (!name || !name.trim()) throw new ValidationError('Tag name is required');

    const existing = await tagRepository.findByNameAndUser(name.trim(), userId);
    if (existing) throw new ConflictError(`Tag "${name}" already exists`);

    const tag = await tagRepository.create({ user_id: userId, name: name.trim() });

    return { _id: tag._id, name: tag.name, count: 0, created_at: tag.created_at };
  }
}

module.exports = new CreateTag();
