// Load enviroment variables from the .env file
require('dotenv').config({ path: '.env' });
const { Sequelize } = require('sequelize');

const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  logging: false,
};

// Instancia para usar en tu app
const db = new Sequelize(dbConfig);

// Exportación combinada
module.exports = {
  db,
  dbConfig,
  development: dbConfig,
  test: dbConfig,
  production: dbConfig,
};
