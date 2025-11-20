'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('vehicles', [
      {
        user_id: 1,
        model: 'CIVIC',
        color: 'ROJO',
        plate_number: 'SPP-1234',
        brand: 'HONDA',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('vehicles', null, {});
  },
};
