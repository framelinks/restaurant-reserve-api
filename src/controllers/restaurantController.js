const restaurantService = require('../services/restaurantService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const createRestaurant = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.createRestaurant(req.body);
    successResponse(res, restaurant, 'Restaurant created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const addTable = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const table = await restaurantService.addTable(parseInt(restaurantId), req.body);
    successResponse(res, table, 'Table added successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await restaurantService.getRestaurant(parseInt(restaurantId));
    if (!restaurant) {
      return errorResponse(res, 'Restaurant not found', 404);
    }
    successResponse(res, restaurant);
  } catch (error) {
    next(error);
  }
};

const getReservationsByDate = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { date } = req.query;
    if (!date) {
      return errorResponse(res, 'Date query parameter is required', 400);
    }
    const reservations = await restaurantService.getReservationsByDate(parseInt(restaurantId), date);
    successResponse(res, reservations);
  } catch (error) {
    next(error);
  }
};

const getAvailability = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { date, partySize } = req.query;
    if (!date || !partySize) {
      return errorResponse(res, 'Date and partySize query parameters are required', 400);
    }
    const availability = await restaurantService.getAvailability(parseInt(restaurantId), date, parseInt(partySize));
    successResponse(res, availability);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRestaurant,
  addTable,
  getRestaurant,
  getReservationsByDate,
  getAvailability
};
