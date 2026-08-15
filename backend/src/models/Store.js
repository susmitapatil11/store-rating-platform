const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: true,
  },
  // links a store to the user account (role = OWNER) that manages it
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'owner_id',
  },
}, {
  tableName: 'stores',
});

module.exports = Store;
