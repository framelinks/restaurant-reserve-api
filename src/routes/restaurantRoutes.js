const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { restaurantValidation, tableValidation } = require('../middleware/validator');

router.post('/', restaurantValidation, restaurantController.createRestaurant);

router.get('/', restaurantController.getAllRestaurants);
router.post('/:restaurantId/tables', tableValidation, restaurantController.addTable);
router.get('/:restaurantId', restaurantController.getRestaurant);
router.get('/:restaurantId/reservations', restaurantController.getReservationsByDate);
router.get('/:restaurantId/availability', restaurantController.getAvailability);

module.exports = router;
