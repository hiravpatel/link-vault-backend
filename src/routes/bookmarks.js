const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Bookmark = require('../models/Bookmark');
const Tag = require('../models/Tag');

// GET /api/bookmarks
router.get('/', auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user_id: req.user._id })
      .populate('tags', 'name _id')
      .sort({ created_at: -1 });
    res.json(bookmarks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/bookmarks
router.post('/', auth, async (req, res) => {
  try {
    const { url, title, description, tag_ids } = req.body;

    if (!url || !title) {
      return res.status(400).json({ message: 'URL and title are required' });
    }

    // Validate tags belong to user
    let validTagIds = [];
    if (tag_ids && tag_ids.length > 0) {
      const tags = await Tag.find({ _id: { $in: tag_ids }, user_id: req.user._id });
      validTagIds = tags.map(t => t._id);
    }

    // Build favicon URL from domain
    let favicon_url = null;
    try {
      const urlObj = new URL(url);
      favicon_url = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch (e) {
      // invalid URL, no favicon
    }

    const bookmark = new Bookmark({
      user_id: req.user._id,
      url,
      title,
      description: description || null,
      favicon_url,
      tags: validTagIds
    });

    await bookmark.save();
    await bookmark.populate('tags', 'name _id');

    res.status(201).json(bookmark);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/bookmarks/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    await Bookmark.deleteOne({ _id: req.params.id });
    res.json({ message: 'Bookmark deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
