// Importa DataTypes de Sequelize para definir los tipos de datos de los campos
// y la instancia de Sequelize para conectar con la base de datos
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

// Define el modelo Product con los campos product_id, product_name, product_price, product_description, product_image, product_category y product_active
const Product = sequelize.define(
    'Product',
    {
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        product_description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        product_image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        product_category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    { freezeTableName: true }
);

module.exports = Product;