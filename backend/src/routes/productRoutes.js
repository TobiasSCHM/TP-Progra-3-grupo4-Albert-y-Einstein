// Importa el módulo express para crear rutas y controladores
const express = require('express');
const productRoutes = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload');
const requireJWT = require('../middlewares/requireJWT');
const { validarAltaProducto, validarModificarProducto } = require('../middlewares/validate');

// Define las rutas para los productos,
// cada ruta llama a una función del controlador correspondiente y utiliza middlewares de validación cuando es necesario
productRoutes.get('/listar', productController.listar);
productRoutes.get('/listarPaginado', productController.listarPaginado);
productRoutes.post('/alta', requireJWT, upload.single('product_image'), validarAltaProducto, productController.alta);
productRoutes.put('/modificar/:id', requireJWT, upload.single('product_image'), validarModificarProducto, productController.modificar);
productRoutes.delete('/baja/:id', requireJWT, productController.baja);

module.exports = { productRoutes };