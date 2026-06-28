// Importa Express, crea un Router e importa el controlador de usuarios y los middlewares de validación
const express = require('express');
const userRoutes = express.Router();
const userController = require('../controllers/userController');
const requireJWT = require('../middlewares/requireJWT');
const { validarAltaUsuario, validarLogin } = require('../middlewares/validate');

// crear un nuevo admin requiere ya estar logueado (token JWT válido), para que no cualquiera pueda crearse un admin
userRoutes.post('/alta', requireJWT, validarAltaUsuario, userController.alta);
userRoutes.post('/login', validarLogin, userController.login); // el login queda público, obviamente

module.exports = { userRoutes };