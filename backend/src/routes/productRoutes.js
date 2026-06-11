// Importa Express, crea un Router e importa el controlador de productos
const express = require('express');
const productRoutes = express.Router();
const productController = require('../controllers/productController');

// Define los endpoints de productos. Cada línea asocia un método HTTP y una URL con una función del controlador:
productRoutes.get('/listar', productController.listar); // trae todos los productos activos
productRoutes.get('/listarPaginado', productController.listarPaginado); // trae los productos de a páginas
productRoutes.post('/alta', productController.alta); // crea un producto nuevo
productRoutes.put('/modificar/:id', productController.modificar); // modifica un producto por su id
productRoutes.delete('/baja/:id', productController.baja); // desactiva un producto por su id

module.exports = { productRoutes };