const reservationService = require('../services/reservationService');
const { successResponse } = require('../utils/responseFormatter');

const createReservation = async (req, res, next) => {
  try {
    const reservation = await reservationService.createReservation(req.body);
    successResponse(res, reservation, 'Reservation created successfully', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReservation };
