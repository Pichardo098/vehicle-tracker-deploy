require('dotenv').config({ path: '.env' });
const { DataTypes } = require('sequelize');
const { db } = require('../database/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Users = db.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secondName: {
      type: DataTypes.STRING,
    },
    firstLastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secondLastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.TEXT,
    },
    password_salt: {
      type: DataTypes.TEXT,
    },
    admin: {
      type: DataTypes.BOOLEAN,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        // Normalize to uppercase
        user.firstName = user.firstName?.toUpperCase();
        user.secondName = user?.secondName?.toUpperCase();
        user.firstLastName = user.firstLastName?.toUpperCase();
        user.secondLastName = user.secondLastName?.toUpperCase();
        user.email = user.email?.toUpperCase();
        user.fullName = user.fullName?.toUpperCase();

        // Generate salt and hash
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password_hash, salt);
        user.password_hash = hash;
        user.password_salt = salt;
      },
      beforeUpdate: async (user) => {
        // Normalize to uppercase
        user.firstName = user.firstName?.toUpperCase();
        user.secondName = user?.secondName?.toUpperCase();
        user.firstLastName = user.firstLastName?.toUpperCase();
        user.secondLastName = user.secondLastName?.toUpperCase();
        user.email = user.email?.toUpperCase();
        user.fullName = user.fullName?.toUpperCase();

        if (user.changed('password_hash')) {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(user.password_hash, salt);
          user.password_hash = hash;
          user.password_salt = salt;
        }
      },
    },
  }
);

Users.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password_hash);
};

Users.prototype.generateJWT = function () {
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
      admin: this.admin,
      fullName: this.fullName,
    },
    process.env.SECRET_JWT_SEED,
    { expiresIn: process.env.JWT_EXPIRE_IN }
  );
};

module.exports = { Users };
