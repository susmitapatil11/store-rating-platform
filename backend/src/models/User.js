const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: [20, 60],
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: true,
    validate: {
      len: [0, 400],
    },
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'USER', 'OWNER'),
    allowNull: false,
    defaultValue: 'USER',
  },
}, {
  tableName: 'users',
});

module.exports = User;
