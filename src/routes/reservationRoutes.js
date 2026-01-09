const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { reservationValidation } = require('../middleware/validator');

router.post('/', reservationValidation, reservationController.createReservation);

module.exports = router;
