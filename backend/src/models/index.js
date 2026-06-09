const User = require('./User');
const Product = require('./Product');
const Sale = require('./Sale');

// Relación muchos a muchos entre Product y Sale
Product.belongsToMany(Sale, { through: 'SaleProducts' });
Sale.belongsToMany(Product, { through: 'SaleProducts' });

module.exports = { User, Product, Sale };