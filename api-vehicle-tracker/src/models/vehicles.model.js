const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Vehicles = db.define(
  'vehicles',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
    },
    plate_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeSave: async (vehicle) => {
        for (const field of ['model', 'color', 'brand', 'plate_number']) {
          if (vehicle[field]) vehicle[field] = vehicle[field].toUpperCase();
        }
      },
    },
  }
);

module.exports = { Vehicles };
