// ---------- Importing Models ---------- //
const { Positions } = require('../models/positions.model');
const { Vehicles } = require('../models/vehicles.model');

// ---------- Importing Utils ---------- //
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { getIO } = require('../sockets/socket');

// Controller to save position
exports.createPosition = catchAsync(async (req, res, next) => {
  const { id: user_id, admin } = req.sessionUser;
  const { vehicle_id, latitude, longitude } = req.body;

  const findVehicle = await Vehicles.findOne({
    where: { id: vehicle_id, active: true },
  });

  if (!findVehicle) {
    return next(
      new AppError('El vehículo no existe o no se encuentra activo.', 404)
    );
  }

  const timestamp = new Date();

  const data = {
    vehicle_id,
    latitude,
    longitude,
    timestamp,
  };

  await Positions.create(data);

  const io = getIO();
  io.to(`vehicle:${vehicle_id}`).emit('vehicle:update', {
    vehicle_id,
    latitude,
    longitude,
    timestamp,
  });

  return res.status(200).json({
    message: 'La posición ha sido registrada exitosamente',
  });
});

// Get latest position by vehicle
exports.getPositionsByVehicle = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return next(
      new AppError(
        'El ID del vehículo debe ser un número entero positivo.',
        400
      )
    );
  }

  const vehicle = await Vehicles.findByPk(id);

  if (!vehicle) {
    return next(new AppError('El vehicuo no existe.', 404));
  }

  const latestPosition = await Positions.findOne({
    where: { vehicle_id: id },
    order: [['timestamp', 'ASC']],
  });

  if (!latestPosition) {
    return next(
      new AppError('No hay posiciones registradas para este vehículo.', 404)
    );
  }

  return res.status(200).json({
    message: 'Última ubicación obtenida correctamente.',
    position: latestPosition || null,
  });
});
