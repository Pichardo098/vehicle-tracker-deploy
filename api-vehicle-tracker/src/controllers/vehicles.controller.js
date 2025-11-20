// ---------- Importing Models ---------- //
const { Users } = require('../models/users.model');
const { Vehicles } = require('../models/vehicles.model');
const { Positions } = require('../models/positions.model');

// ---------- Importing Utils ---------- //
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { Op } = require('sequelize');

// Controller to create a vehicle
exports.createVehicle = catchAsync(async (req, res, next) => {
  const { model, color, plate_number, brand, user_id } = req.body;

  const plateNumberExists = await Vehicles.findOne({
    where: { plate_number: plate_number.toUpperCase() },
  });

  if (plateNumberExists) {
    return next(
      new AppError(
        'Ya existe un veichulo registrado con el mismo número de placa.',
        401
      )
    );
  }

  const data = {
    user_id,
    model,
    color,
    plate_number,
    brand,
  };

  const saveVehicle = await Vehicles.create(data);

  return res.status(201).json({
    message: 'Vehiculo creado correctamente',
    vehicle: saveVehicle,
  });
});

// Controller to update vehicle
exports.updateVehicle = catchAsync(async (req, res, next) => {
  const { model, color, plate_number, brand, id } = req.body;

  const existsVehicle = await Vehicles.findOne({
    where: {
      plate_number: plate_number.toUpperCase(),
      active: true,
      id: { [Op.ne]: id },
    },
  });

  if (existsVehicle) {
    return next(new AppError('Las placas ya han sido registradas', 400));
  }

  const vehicle = await Vehicles.findOne({ where: { id, active: true } });

  if (!vehicle) {
    return next(new AppError('El vehículo no existe o está inactivo', 404));
  }

  await vehicle.update({ model, color, plate_number, brand });

  return res.status(200).json({
    message: 'Vehículo actualizado correctamente.',
  });
});

// Controller to inactivate
exports.inactiveVehicle = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  // Find vehicle
  const vehicle = await Vehicles.findByPk(id);

  if (!vehicle) {
    return next(new AppError('El vehículo no existe.', 404));
  }

  if (!vehicle.active) {
    return next(new AppError('El vehículo ya se encuentra inactivo.', 400));
  }

  await vehicle.update({ active: false });

  return res.status(200).json({
    message: 'El vehículo ha sido inactivado',
  });
});

// Controller to view all vehicles
exports.getAllVehicles = catchAsync(async (req, res, next) => {
  const { admin, id: user_id } = req.sessionUser;

  const query = {
    where: admin ? { active: true } : { user_id, active: true },
    attributes: [
      'id',
      'user_id',
      'model',
      'color',
      'brand',
      'plate_number',
      'active',
      'createdAt',
    ],
    include: [
      {
        model: Users,
        as: 'user',
        attributes: ['fullName'],
      },
    ],
    order: [['createdAt', 'DESC']],
  };

  const findVehicles = await Vehicles.findAll(query, {});

  return res.status(200).json({
    message: 'Vehiculos obtenidos correctamente.',
    vehicles: findVehicles || [],
  });
});

// Controller to view a vehicle by ID
exports.getVehicleById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { admin, id: user_id } = req.sessionUser;

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return next(
      new AppError(
        'El ID del vehículo debe ser un número entero positivo.',
        400
      )
    );
  }

  const vehicle = await Vehicles.findOne({
    where: { id, active: true },
    include: [
      {
        model: Users,
        as: 'user',
        attributes: ['fullName'],
      },
      {
        model: Positions,
        as: 'positions',
        attributes: ['latitude', 'longitude', 'timestamp'],
        order: [['timestamp', 'DESC']],
        limit: 1,
      },
    ],
  });

  if (!vehicle) {
    return next(new AppError('El vehículo no existe.', 404));
  }

  return res.status(200).json({
    message: 'Vehículo obtenido correctamente.',
    vehicle,
  });
});
