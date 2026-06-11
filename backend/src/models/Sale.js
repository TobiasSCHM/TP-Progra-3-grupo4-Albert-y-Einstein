// Importa DataTypes de Sequelize para definir los tipos de datos de los campos
// y la instancia de Sequelize para conectar con la base de datos
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

// Define el modelo Sale con los campos sale_id, sale_customer_name, sale_total y sale_date
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