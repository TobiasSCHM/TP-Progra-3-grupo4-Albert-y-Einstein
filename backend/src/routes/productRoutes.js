const express = require('express');
const productRoutes = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload');
const { validarAltaProducto, validarModificarProducto } = require('../middlewares/validate');

productRoutes.get('/listar', productController.listar);
productRoutes.get('/listarPaginado', productController.listarPaginado);
productRoutes.post('/alta', upload.single('product_image'), validarAltaProducto, productController.alta);
productRoutes.put('/modificar/:id', upload.single('product_image'), validarModificarProducto, productController.modificar);
productRoutes.delete('/baja/:id', productController.baja);

module.exports = { productRoutes };