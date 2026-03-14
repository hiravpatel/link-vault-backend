const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /api/users/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password_hash');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { display_name, avatar, profile_setup_done } = req.body;
    const updates = {};
    if (display_name !== undefined) updates.display_name = display_name;
    if (avatar !== undefined) updates.avatar = avatar;
    if (profile_setup_done !== undefined) updates.profile_setup_done = profile_setup_done;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select('-password_hash');

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      display_name: user.display_name,
      avatar: user.avatar,
      profile_setup_done: user.profile_setup_done
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
