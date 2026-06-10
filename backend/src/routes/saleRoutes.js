const express = require('express');
const saleRoutes = express.Router();
const saleController = require('../controllers/saleController');

saleRoutes.get('/listar', saleController.listar);
saleRoutes.post('/alta', saleController.alta);

module.exports = { saleRoutes };