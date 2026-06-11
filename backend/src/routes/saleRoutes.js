// Importa Express, crea un Router e importa el controlador de ventas
const express = require('express');
const saleRoutes = express.Router();
const saleController = require('../controllers/saleController');

// Define los endpoints de ventas. Cada línea asocia un método HTTP y una URL con una función del controlador:
saleRoutes.get('/listar', saleController.listar); // permite listar todas las ventas
saleRoutes.post('/alta', saleController.alta); // permite registrar una nueva venta

module.exports = { saleRoutes };