const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'store_id',
  },
}, {
  tableName: 'ratings',
  indexes: [
    // a user can only rate a given store once - they update it instead of re-inserting
    { unique: true, fields: ['user_id', 'store_id'] },
  ],
});

module.exports = Rating;
