const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const File = sequelize.define('File', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.BLOB('long'),
    allowNull: false
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
});

module.exports = File;
