const { Sequelize } = require('sequelize');
require('dotenv').config();

// Same idea as spring.jpa.hibernate.ddl-auto=update -> we call sequelize.sync({ alter: true })
// in server.js so tables get created/updated automatically, no manual SQL needed.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
    },
  }
);

module.exports = sequelize;
