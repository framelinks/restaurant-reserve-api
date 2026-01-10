const prisma = require('../config/database');
const { isWithinOperatingHours } = require('../utils/timeHelper');

const createReservation = async (data) => {
  const { restaurantId, partySize, startTime: startStr, durationMinutes, ...rest } = data;
  const startTime = new Date(startStr);
  const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  if (!isWithinOperatingHours(startTime, endTime, restaurant.opensAt, restaurant.closesAt)) {
    throw new Error('Reservation outside operating hours');
  }

  const tables = await prisma.table.findMany({
    where: { restaurantId, capacity: { gte: partySize } }
  });

  let availableTable = null;
  for (const table of tables) {
    const overlapping = await prisma.reservation.count({
      where: {
        tableId: table.id,
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } }
        ]
      }
    });
    if (overlapping === 0) {
      availableTable = table;
      break;
    }
  }

  if (!availableTable) {
    throw new Error('No available table for this reservation');
  }

  return prisma.reservation.create({
    data: {
      ...rest,
      restaurantId,
      tableId: availableTable.id,
      partySize,
      startTime,
      endTime,
      durationMinutes,
      status: 'confirmed'
    }
  });
};

module.exports = { createReservation };
