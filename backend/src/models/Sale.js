const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Sale = sequelize.define(
    'Sale',
    {
        sale_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        sale_customer_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sale_total: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        sale_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    { freezeTableName: true }
);

module.exports = Sale;