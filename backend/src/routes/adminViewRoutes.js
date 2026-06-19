// Importa Express y crea un Router exclusivo para las vistas del panel de administrador
const express = require('express');
const adminViewRoutes = express.Router();
const { User } = require('../models/index');
const bcrypt = require('bcrypt');

// Define el endpoint que renderiza la vista de login del administrador
adminViewRoutes.get('/login', (req, res) => {
    res.render('login');
});

// Procesa el formulario de login del admin
adminViewRoutes.post('/login', async (req, res) => {
    try {
        const { user_email, user_password } = req.body;
        const usuario = await User.findOne({ where: { user_email } });

        if (!usuario) {
            return res.render('login', { error: 'Usuario no encontrado' });
        }

        const match = await bcrypt.compare(user_password, usuario.user_password);
        if (!match) {
            return res.render('login', { error: 'Contraseña incorrecta' });
        }

        // Login correcto, por ahora mostramos un mensaje simple hasta tener el dashboard
        res.send(`Login exitoso. Bienvenido, ${usuario.user_email}`);
    } catch (error) {
        res.render('login', { error: 'Error al iniciar sesión' });
    }
});

module.exports = { adminViewRoutes };