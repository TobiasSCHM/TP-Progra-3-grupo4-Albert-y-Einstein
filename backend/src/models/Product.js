const { DataTypes } = require('sequelize');
const sequelize = require('../database');

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