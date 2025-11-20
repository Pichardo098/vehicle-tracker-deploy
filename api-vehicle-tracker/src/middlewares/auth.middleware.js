// ---------- Importing Models ---------- //
const { Users } = require('../models/users.model');

// ---------- Importing Utils ---------- //
const { promisify } = require('util');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Es necesario iniciar sesión.', 401));
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await Users.findOne({
    where: { id: decoded.id },
    attributes: ['id', 'fullName', 'email', 'admin'],
    raw: true,
  });

  if (!user) {
    return next(new AppError('El usuario no existe.', 401));
  }

  req.sessionUser = user;
  next();
});
