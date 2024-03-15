const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const session = require('express-session');

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
// route.get('/getUser', userController.getUser);
// router.post('profile-edit', userController.editProfile);
module.exports = router;