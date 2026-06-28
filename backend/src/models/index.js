// Importa DataTypes y la instancia de Sequelize, para poder definir la tabla intermedia con un campo propio
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = require('./User');
const Product = require('./Product');
const Sale = require('./Sale');

// Antes la tabla intermedia entre Product y Sale era solo un string ('SaleProducts'),
// generada automáticamente por Sequelize sin columnas propias.
// Ahora la definimos como modelo propio para poder agregarle "cantidad"
// (antes no se guardaba cuántas unidades de cada producto se vendieron, solo qué productos).
// OJO: se mantiene el mismo nombre de tabla ('SaleProducts') para no perder las ventas que ya tengas guardadas.
const SaleProduct = sequelize.define(
    'SaleProducts',
    {
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    },
    { freezeTableName: true }
);

Product.belongsToMany(Sale, { through: SaleProduct });
Sale.belongsToMany(Product, { through: SaleProduct });

module.exports = { User, Product, Sale, SaleProduct };