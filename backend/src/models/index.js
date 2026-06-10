const User = require('./User');
const Product = require('./Product');
const Sale = require('./Sale');

// Relación muchos a muchos entre Product y Sale
Product.belongsToMany(Sale, { through: 'SaleProducts', freezeTableName: true });
Sale.belongsToMany(Product, { through: 'SaleProducts', freezeTableName: true });

module.exports = { User, Product, Sale };