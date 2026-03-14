const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Tag = require('../models/Tag');
const Bookmark = require('../models/Bookmark');

// GET /api/tags  (with bookmark counts)
router.get('/', auth, async (req, res) => {
  try {
    const tags = await Tag.find({ user_id: req.user._id }).sort({ name: 1 });

    // Get bookmark counts per tag
    const tagIds = tags.map(t => t._id);
    const counts = await Bookmark.aggregate([
      { $match: { user_id: req.user._id, tags: { $in: tagIds } } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach(c => { countMap[c._id.toString()] = c.count; });

    const tagsWithCount = tags.map(t => ({
      _id: t._id,
      name: t.name,
      count: countMap[t._id.toString()] || 0,
      created_at: t.created_at
    }));

    res.json(tagsWithCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tags
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Tag name is required' });
    }

    const existing = await Tag.findOne({ user_id: req.user._id, name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Tag already exists' });
    }

    const tag = new Tag({ user_id: req.user._id, name: name.trim() });
    await tag.save();

    res.status(201).json({ _id: tag._id, name: tag.name, count: 0, created_at: tag.created_at });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Tag already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tags/bulk - create multiple tags at once (for profile setup)
router.post('/bulk', auth, async (req, res) => {
  try {
    const { names } = req.body;
    if (!names || !Array.isArray(names)) {
      return res.status(400).json({ message: 'names array is required' });
    }

    const created = [];
    for (const name of names) {
      try {
        const tag = new Tag({ user_id: req.user._id, name: name.trim() });
        await tag.save();
        created.push({ _id: tag._id, name: tag.name, count: 0, created_at: tag.created_at });
      } catch (e) {
        // Skip duplicates silently
        if (e.code !== 11000) throw e;
      }
    }

    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/tags/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const tag = await Tag.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Remove tag from all bookmarks
    await Bookmark.updateMany(
      { user_id: req.user._id },
      { $pull: { tags: tag._id } }
    );

    await Tag.deleteOne({ _id: req.params.id });
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
