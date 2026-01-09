const prisma = require('../config/database');

const createRestaurant = async ({ name, opensAt, closesAt }) => {
  return prisma.restaurant.create({
    data: { name, opensAt, closesAt }
  });
};

const addTable = async (restaurantId, { tableNumber, capacity }) => {
  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  return prisma.table.create({
    data: { restaurantId, tableNumber, capacity }
  });
};

const getRestaurant = async (id) => {
  return prisma.restaurant.findUnique({
    where: { id },
    include: { tables: true }
  });
};

const getReservationsByDate = async (restaurantId, date) => {
  const startOfDay = new Date(`${date}T00:00:00`);
  const endOfDay = new Date(`${date}T23:59:59`);
  return prisma.reservation.findMany({
    where: {
      restaurantId,
      startTime: { gte: startOfDay, lte: endOfDay }
    },
    orderBy: { startTime: 'asc' }
  });
};

const getAvailability = async (restaurantId, date, partySize) => {
  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  const tables = await prisma.table.findMany({
    where: { restaurantId, capacity: { gte: partySize } }
  });

  const startOfDay = new Date(`${date}T${restaurant.opensAt}:00`);
  const endOfDay = new Date(`${date}T${restaurant.closesAt}:00`);

  const availability = [];
  for (const table of tables) {
    const reservations = await prisma.reservation.findMany({
      where: {
        tableId: table.id,
        OR: [
          { startTime: { lte: endOfDay } },
          { endTime: { gte: startOfDay } }
        ]
      },
      orderBy: { startTime: 'asc' }
    });

    let slots = [];
    let currentTime = startOfDay;
    for (const res of reservations) {
      if (currentTime < res.startTime) {
        slots.push(`${formatTime(currentTime)}-${formatTime(res.startTime)}`);
      }
      currentTime = new Date(Math.max(currentTime.getTime(), res.endTime.getTime()));
    }
    if (currentTime < endOfDay) {
      slots.push(`${formatTime(currentTime)}-${formatTime(endOfDay)}`);
    }

    if (slots.length > 0) {
      availability.push({ tableId: table.id, availableSlots: slots });
    }
  }

  return availability;
};

const formatTime = (date) => {
  return date.toISOString().slice(11, 16);
};

module.exports = {
  createRestaurant,
  addTable,
  getRestaurant,
  getReservationsByDate,
  getAvailability
};
