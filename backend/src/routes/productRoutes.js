const express = require('express');
const productRoutes = express.Router();
const productController = require('../controllers/productController');

productRoutes.get('/listar', productController.listar);
productRoutes.get('/listarPaginado', productController.listarPaginado);
productRoutes.post('/alta', productController.alta);
productRoutes.put('/modificar/:id', productController.modificar);
productRoutes.delete('/baja/:id', productController.baja);

module.exports = { productRoutes };