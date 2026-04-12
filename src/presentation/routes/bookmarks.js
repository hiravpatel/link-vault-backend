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
    body('type').optional().isIn(['link', 'note', 'prompt']).withMessage('Type must be link, note, or prompt'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('tag_ids').optional().isArray().withMessage('Tags must be an array'),
    body('category').optional().isLength({ max: 80 }).withMessage('Category must be 80 characters or fewer'),
  ],
  bookmarkController.create
);

router.patch(
  '/:id',
  [
    body('type').optional().isIn(['link', 'note', 'prompt']).withMessage('Type must be link, note, or prompt'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('tag_ids').optional().isArray().withMessage('Tags must be an array'),
    body('category').optional({ values: 'falsy' }).isLength({ max: 80 }).withMessage('Category must be 80 characters or fewer'),
  ],
  bookmarkController.update
);

router.delete('/:id', bookmarkController.remove);

module.exports = router;
