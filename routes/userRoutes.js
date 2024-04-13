const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const session = require('express-session');

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.get('/profile', userController.getUser);
router.get('/edittprofile', userController.getUser);
router.get('/reserve', userController.getUser);
router.get('/viewprofile', userController.getUser);
router.post('/editDescription', userController.editDescription);
router.post('/editPFP', userController.editPFP);
router.delete('/delete', userController.deleteUser);
router.post('/logout', userController.logoutUser);


module.exports = router;
