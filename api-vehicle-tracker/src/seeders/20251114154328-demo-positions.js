'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('positions', [
      {
        vehicle_id: 1,
        latitude: 20.6736,
        longitude: -103.3925,
        timestamp: new Date(now.getTime() - 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('positions', null, {});
  },
};
