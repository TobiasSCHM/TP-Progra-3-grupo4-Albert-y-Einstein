const express = require('express');
const userRoutes = express.Router();
const userController = require('../controllers/userController');
const { validarAltaUsuario, validarLogin } = require('../middlewares/validate');

userRoutes.post('/alta', validarAltaUsuario, userController.alta);
userRoutes.post('/login', validarLogin, userController.login);

module.exports = { userRoutes };