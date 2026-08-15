require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');
require('./models'); // register associations before sync

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    // mirrors ddl-auto=update from Spring Boot - creates/updates tables to match the models
    await sequelize.sync({ alter: true });
    console.log('Tables synced');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();
