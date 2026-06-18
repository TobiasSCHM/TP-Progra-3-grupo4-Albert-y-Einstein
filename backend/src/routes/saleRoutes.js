// Importa los módulos necesarios para definir las rutas de ventas
const express = require('express');
const saleRoutes = express.Router();
const saleController = require('../controllers/saleController');
const { validarAltaVenta } = require('../middlewares/validate');

// Define las rutas para las ventas,
// cada ruta llama a una función del controlador correspondiente y utiliza middlewares de validación cuando es necesario
saleRoutes.get('/listar', saleController.listar);
saleRoutes.post('/alta', validarAltaVenta, saleController.alta);

module.exports = { saleRoutes };