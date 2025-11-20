const { body, validationResult } = require('express-validator');

// ---------- Importing Models ---------- //
const { Users } = require('../models/users.model');
const { Vehicles } = require('../models/vehicles.model');
const { Positions } = require('../models/positions.model');

const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }

  next();
};

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

// ---------- Users validations ---------- //
exports.createUserValidation = [
  body('firstName').notEmpty().withMessage('El nombre es obligatorio.'),
  body('firstLastName')
    .notEmpty()
    .withMessage('El apellido paterno es obligatorio.'),
  body('secondLastName')
    .notEmpty()
    .withMessage('El apellido materno es obligatorio.'),
  body('email')
    .notEmpty()
    .withMessage('El correo electrónico es obligatorio.')
    .isEmail()
    .withMessage('Debe proporcionar un correo electrónico válido.'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .matches(passwordRegex)
    .withMessage(
      'La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial.'
    ),
  body('admin')
    .notEmpty()
    .withMessage('El campo admin debe ser obligatorio')
    .isBoolean()
    .withMessage('El campo "admin" debe ser de tipo booleano.'),
  validFields,
];

exports.changePassword = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Debe proporcionar su contraseña actual.'),
  body('newPassword')
    .notEmpty()
    .withMessage('Debe proporcionar una nueva contraseña.')
    .matches(passwordRegex)
    .withMessage(
      'La nueva contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial.'
    ),
  validFields,
];

exports.loginUser = [
  body('email')
    .notEmpty()
    .withMessage('El correo electrónico es obligatorio.')
    .isEmail()
    .withMessage('Debe proporcionar un correo electrónico válido.'),
  body('password').notEmpty().withMessage('Debe proporcionar su contraseña.'),
  validFields,
];

// ---------- Vehicles validations ---------- //
// Validations to create a vehicle
exports.createVehicleValidation = [
  body('model').notEmpty().withMessage('El campo "modelo" es obligatorio.'),
  body('color').notEmpty().withMessage('El campo "color" es obligatorio.'),
  body('plate_number')
    .notEmpty()
    .withMessage('El campo "número de placa" es obligatorio.'),
  body('brand').notEmpty().withMessage('El campo "marca" es obligatorio.'),
  validFields,
];

// Validations to update a vehicle
exports.updateVehicleValidation = [
  body('id')
    .notEmpty()
    .withMessage('El ID del vehículo es obligatorio.')
    .isInt()
    .withMessage('El ID debe ser un número entero.'),
  body('model').notEmpty().withMessage('El campo "modelo" es obligatorio.'),
  body('color').notEmpty().withMessage('El campo "color" es obligatorio.'),
  body('plate_number')
    .notEmpty()
    .withMessage('El campo "número de placa" es obligatorio.'),
  body('brand').notEmpty().withMessage('El campo "marca" es obligatorio.'),
  validFields,
];

// validations to inactive vehicle
exports.inactiveVehicleValidation = [
  body('id')
    .notEmpty()
    .withMessage('El ID del vehículo es obligatorio.')
    .isInt()
    .withMessage('El ID debe ser un número entero.'),
  validFields,
];

// ---------- Positions validations ---------- //
exports.createPosition = [
  body('vehicle_id')
    .notEmpty()
    .withMessage('El ID del vehículo es obligatorio.')
    .isInt()
    .withMessage('El ID debe ser un número entero.'),
  ,
  body('latitude')
    .notEmpty()
    .withMessage('La latitud es obligatoria.')
    .isFloat({ min: -90, max: 90 })
    .withMessage('La latitud debe ser un número válido entre -90 y 90.'),
  body('longitude')
    .notEmpty()
    .withMessage('La longitud es obligatoria.')
    .isFloat({ min: -180, max: 180 })
    .withMessage('La longitud debe ser un número válido entre -180 y 180.'),
  validFields,
];
