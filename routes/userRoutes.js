const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const session = require('express-session');

router.post('/login', userController.loginUser);
router.post('/retrieveuser', userController.returnUser);

module.exports = router;