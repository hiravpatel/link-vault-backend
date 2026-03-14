const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 255
  },
  password_hash: {
    type: String,
    required: true
  },
  display_name: {
    type: String,
    trim: true,
    maxlength: 100,
    default: null
  },
  avatar: {
    type: String,
    default: '🦊',
    maxlength: 10
  },
  profile_setup_done: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('User', userSchema);
