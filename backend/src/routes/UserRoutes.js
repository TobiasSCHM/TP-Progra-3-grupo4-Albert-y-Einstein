const express = require('express');
const userRoutes = express.Router();
const userController = require('../controllers/userController');

userRoutes.post('/alta', userController.alta);
userRoutes.post('/login', userController.login);

module.exports = { userRoutes };