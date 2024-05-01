const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const User = require('./userModel'); // Importez le modèle User

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
  },
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
});

module.exports = File;
