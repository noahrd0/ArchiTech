const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const File = sequelize.define('file', {
    uuid : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name : {
        type: DataTypes.STRING,
        allowNull: false
    },
    size : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type : {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
}, {
    tableName: 'file'
});

module.exports = File;