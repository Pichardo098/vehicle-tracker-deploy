'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Generar hash de contraseña (password: "Password123.'")
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password123.', salt);

    await queryInterface.bulkInsert('users', [
      {
        firstName: 'JUAN',
        secondName: 'CARLOS',
        firstLastName: 'PEREZ',
        secondLastName: 'GARCIA',
        fullName: 'JUAN CARLOS PEREZ GARCIA',
        email: 'ADMIN@EXAMPLE.COM',
        password_hash: passwordHash,
        password_salt: salt,
        admin: true,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
