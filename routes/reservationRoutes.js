const express = require('express');
const router = express.Router();
const reservationController = require('../controller/reservationController');
const session = require('express-session');


router.post('/createReservation', reservationController.createReservation);
router.get('/retrievePost', reservationController.getReservation);
router.get('/allReservations', reservationController.getAllReservations);
router.get('/profile', reservationController.getUserReservations);
router.get('/reserve', reservationController.getUserReservations);
router.get('/viewprofile', reservationController.getUserReservations);


// router.post('profile-edit', userController.editProfile);
module.exports = router;