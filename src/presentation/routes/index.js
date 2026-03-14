const express = require('express');
const ApiResponse = require('../../shared/ApiResponse');

const authRoutes = require('./auth');
const userRoutes = require('./users');
const bookmarkRoutes = require('./bookmarks');
const tagRoutes = require('./tags');

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  ApiResponse.success(res, 'Backend is healthy', {
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// App routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/bookmarks', bookmarkRoutes);
router.use('/tags', tagRoutes);

module.exports = router;
