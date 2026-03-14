const tagRepository = require('../../../infrastructure/database/repositories/TagRepository');

class CreateBulkTags {
  async execute({ userId, names }) {
    if (!Array.isArray(names) || names.length === 0) return [];

    const tagsData = names.map(name => ({ user_id: userId, name: name.trim() }));
    const created = await tagRepository.createMany(tagsData);

    return created.map(t => ({ _id: t._id, name: t.name, count: 0, created_at: t.created_at }));
  }
}

module.exports = new CreateBulkTags();
