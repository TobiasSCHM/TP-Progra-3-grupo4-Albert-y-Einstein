// Importa los módulos necesarios para definir las rutas de productos
const express = require('express');
const productRoutes = express.Router();
const productController = require('../controllers/productController');
const { validarAltaProducto, validarModificarProducto } = require('../middlewares/validate');

// Define las rutas para los productos,
// cada ruta llama a una función del controlador correspondiente y utiliza middlewares de validación cuando es necesario
productRoutes.get('/listar', productController.listar);
productRoutes.get('/listarPaginado', productController.listarPaginado);
productRoutes.post('/alta', validarAltaProducto, productController.alta);
productRoutes.put('/modificar/:id', validarModificarProducto, productController.modificar);
productRoutes.delete('/baja/:id', productController.baja);

module.exports = { productRoutes };