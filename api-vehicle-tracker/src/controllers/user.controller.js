// ---------- Importing Models ---------- //
const { raw } = require('express');
const { Users } = require('../models/users.model');

// ---------- Importing Utils ---------- //
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Controller to create users
exports.createUser = catchAsync(async (req, res, next) => {
  const {
    firstName,
    secondName,
    firstLastName,
    secondLastName,
    email,
    password,
    admin,
  } = req.body;

  if (password.includes(' ')) {
    return next(new AppError('La contraseña no debe contener espacios.', 400));
  }

  const emailExists = await Users.findOne({
    where: { email, active: true },
  });

  if (emailExists) {
    return next(
      new AppError('Ya existe el email registrado, prueba con otro'),
      404
    );
  }

  const fullName = [firstName, secondName, firstLastName, secondLastName]
    .filter(Boolean)
    .join(' ');

  const data = {
    firstName,
    secondName,
    firstLastName,
    secondLastName,
    fullName,
    password_hash: password,
    email,
    admin,
  };

  const saveUser = await Users.create(data);

  const token = saveUser.generateJWT();

  return res.status(200).json({
    message: 'Usuario creado exitosamente.',
    token,
    user: {
      id: saveUser.id,
      fullName: saveUser.fullName,
      email: saveUser.email,
      admin: saveUser.admin,
    },
  });
});

// Controller to login
exports.loginUser = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;

  email = email.toUpperCase();

  const findUser = await Users.findOne({
    where: { email, active: true },
  });

  if (!findUser) {
    return next(new AppError('Usuario o contraseña incorrectos.'), 401);
  }

  const validPassword = await findUser.validatePassword(password);

  if (!validPassword) {
    return next(new AppError('Usuario o contraseña incorrectos.'), 401);
  }

  const token = findUser.generateJWT();

  return res.status(200).json({
    message: 'Usuario verificado exitosamente.',
    token,
    user: {
      id: findUser.id,
      fullName: findUser.fullName,
      email: findUser.email,
      admin: findUser.admin,
    },
  });
});

// Controller to change password
exports.changePassword = catchAsync(async (req, res, next) => {
  const { id: userId } = req.sessionUser;
  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    return next(
      new AppError('La nueva contraseña debe ser diferente a la actual.'),
      404
    );
  }

  const findUser = await Users.findOne({
    where: {
      id: userId,
      active: true,
    },
  });

  if (!findUser) {
    return next(new AppError('El usuario no existe', 404));
  }

  const verifyOldPassword = await findUser.validatePassword(oldPassword);

  if (!verifyOldPassword) {
    return next(new AppError('La contraseña es incorrecta.', 401));
  }

  await findUser.update({ password_hash: newPassword });

  return res.status(200).json({
    message: 'Contraseña actualizada con éxito.',
  });
});

// Controller to get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await Users.findAll(
    {
      where: { active: true },
      attributes: { exclude: ['password_hash', 'password_salt'] },
    },
    { raw: true }
  );

  return res.status(200).json({
    message: 'Usuarios obtenidos con éxito.',
    users: users || [],
  });
});
