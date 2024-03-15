const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const session = require('express-session');

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.get('/profile', userController.getUser);
router.get('/edittprofile', userController.getUser);
router.get('/reserve', userController.getUser);

// route.get('/getUser', userController.getUser);
// router.post('profile-edit', userController.editProfile);
module.exports = router;
