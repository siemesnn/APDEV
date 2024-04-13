const express = require('express');
const router = express.Router();
const labController = require('../controller/labController');
const session = require('express-session');

// Define the route with the labId parameter
router.post('/reserve/:labId', labController.reserveASeat);
router.delete('/delete', labController.deleteReservation);
router.delete('/deleteUserRes', labController.deleteAllReservationsBasedOnUser);
router.delete('/deleteFromLab', labController.deleteReservationFromLab);
router.put('/updateProfile', labController.updateReservationProfile);


module.exports = router;
