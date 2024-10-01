const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('invoice', {
    id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    date : {
        type: DataTypes.DATE,
        allowNull: false
    },
    stripe_session_id : {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'invoice',
    timestamps: false
});

module.exports = Invoice;