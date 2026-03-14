const tagRepository = require('../../../infrastructure/database/repositories/TagRepository');

class GetTags {
  async execute(userId) {
    const tags = await tagRepository.findAllByUser(userId);
    const tagIds = tags.map(t => t._id);
    const counts = await tagRepository.getCountsByUser(userId, tagIds);

    const countMap = {};
    counts.forEach(c => { countMap[c._id.toString()] = c.count; });

    return tags.map(t => ({
      _id: t._id,
      name: t.name,
      count: countMap[t._id.toString()] || 0,
      created_at: t.created_at,
    }));
  }
}

module.exports = new GetTags();
