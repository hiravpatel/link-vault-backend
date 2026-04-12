const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['link', 'note', 'prompt'],
    default: 'link',
    index: true,
  },
  url: {
    type: String,
    trim: true,
    default: null,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 5000,
    default: null,
  },
  content: {
    type: String,
    trim: true,
    maxlength: 10000,
    default: null,
  },
  category: {
    type: String,
    trim: true,
    maxlength: 80,
    default: null,
  },
  favicon_url: {
    type: String,
    default: null,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  last_accessed_at: {
    type: Date,
    default: null,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

bookmarkSchema.index({ user_id: 1, created_at: -1 });
bookmarkSchema.index({ user_id: 1, type: 1, created_at: -1 });
bookmarkSchema.index({ user_id: 1, category: 1 });
bookmarkSchema.index({ user_id: 1, tags: 1 });
bookmarkSchema.index({
  user_id: 1,
  title: 'text',
  url: 'text',
  description: 'text',
  content: 'text',
  category: 'text',
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
