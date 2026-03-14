const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

// No duplicate tag names per user
tagSchema.index({ user_id: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Tag', tagSchema);
