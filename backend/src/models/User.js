const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define(
    'User',
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        user_password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    { freezeTableName: true }
);

module.exports = User;