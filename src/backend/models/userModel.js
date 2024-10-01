const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('user', {
    id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false
    },
    password : {
        type: DataTypes.STRING,
        allowNull: false
    },
    role : {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
    },
    storage : {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'user',
    timestamps: false
});

module.exports = User;