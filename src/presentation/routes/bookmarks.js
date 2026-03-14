const express = require('express');
const { body } = require('express-validator');
const authenticate = require('../middlewares/authenticate');
const bookmarkController = require('../controllers/BookmarkController');

const router = express.Router();

router.use(authenticate);

router.get('/', bookmarkController.getAll);

router.post(
  '/',
  [
    body('url').isURL().withMessage('Valid URL is required'),
    body('title').notEmpty().withMessage('Title is required'),
  ],
  bookmarkController.create
);

router.delete('/:id', bookmarkController.remove);

module.exports = router;
