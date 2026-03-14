const express = require('express');
const { body } = require('express-validator');
const authenticate = require('../middlewares/authenticate');
const tagController = require('../controllers/TagController');

const router = express.Router();

router.use(authenticate);

router.get('/', tagController.getAll);

router.post(
  '/',
  [body('name').notEmpty().withMessage('Tag name is required')],
  tagController.create
);

router.post(
  '/bulk',
  [body('names').isArray().withMessage('Names must be an array')],
  tagController.createBulk
);

router.delete('/:id', tagController.remove);

module.exports = router;
