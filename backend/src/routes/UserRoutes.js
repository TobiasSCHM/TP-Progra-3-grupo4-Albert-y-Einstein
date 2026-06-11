// Importa Express, crea un Router e importa el controlador de usuarios y los middlewares de validación
const express = require('express');
const userRoutes = express.Router();
const userController = require('../controllers/userController');
const { validarAltaUsuario, validarLogin } = require('../middlewares/validate');

// Define los endpoints de usuarios. Cada línea asocia un método HTTP y una URL con una función del controlador:
userRoutes.post('/alta', validarAltaUsuario, userController.alta); // permite a un usuario registrarse
userRoutes.post('/login', validarLogin, userController.login); // permite a un usuario iniciar sesión

module.exports = { userRoutes };