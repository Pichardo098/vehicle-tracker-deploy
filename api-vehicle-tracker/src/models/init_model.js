// ---------- Importing Models ---------- //
const { Users } = require('./users.model');
const { Vehicles } = require('./vehicles.model');
const { Positions } = require('./positions.model');

const initModel = () => {
  // Relation User -> Vehicles
  Users.hasMany(Vehicles, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Vehicles.belongsTo(Users, { foreignKey: 'user_id' });

  // Relation Vehicles -> Positions
  Vehicles.hasMany(Positions, {
    foreignKey: 'vehicle_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Positions.belongsTo(Vehicles, { foreignKey: 'vehicle_id' });
};

module.exports = initModel;
