const { body, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const restaurantValidation = [
  body('name').trim().notEmpty().isLength({ min: 2, max: 255 }),
  body('opensAt').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('closesAt').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  validate
];

const tableValidation = [
  body('tableNumber').trim().notEmpty().isLength({ min: 1, max: 50 }), // Changed this line
  body('capacity').isInt({ min: 1, max: 20 }),
  validate
];

const reservationValidation = [
  body('restaurantId').isInt({ min: 1 }),
  body('customerName').trim().notEmpty(),
  body('phone').matches(/^[0-9]{10,15}$/),
  body('partySize').isInt({ min: 1, max: 20 }),
  body('startTime').isISO8601(),
  body('durationMinutes').isInt({ min: 30, max: 480 }),
  validate
];

module.exports = { restaurantValidation, tableValidation, reservationValidation };