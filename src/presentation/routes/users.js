const express = require('express');
const authenticate = require('../middlewares/authenticate');
const userController = require('../controllers/UserController');

const router = express.Router();

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;
