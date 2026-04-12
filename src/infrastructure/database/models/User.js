const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 255,
  },
  password_hash: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  display_name: {
    type: String,
    trim: true,
    maxlength: 100,
    default: null,
  },
  avatar: {
    type: String,
    default: 'LV',
    maxlength: 32,
  },
  profile_setup_done: {
    type: Boolean,
    default: false,
  },
  refresh_token_hash: {
    type: String,
    select: false,
    default: null,
  },
  refresh_token_expires_at: {
    type: Date,
    select: false,
    default: null,
  },
  password_reset_token_hash: {
    type: String,
    select: false,
    default: null,
  },
  password_reset_expires_at: {
    type: Date,
    select: false,
    default: null,
  },
  password_changed_at: {
    type: Date,
    default: null,
  },
  last_login_at: {
    type: Date,
    default: null,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('User', userSchema);
