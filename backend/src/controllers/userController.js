const { User } = require('../models/index');
const bcrypt = require('bcrypt');

const alta = async (req, res, next) => {
    try {
        const { user_email, user_password } = req.body;
        const hash = await bcrypt.hash(user_password, 10);
        const usuario = await User.create({
            user_email,
            user_password: hash
        });
        res.status(201).send({ status: 'Usuario creado', id: usuario.user_id });
    } catch (error) {
        res.status(500).send({ error: 'Error al crear usuario' });
    }
};

const login = async (req, res, next) => {
    try {
        const { user_email, user_password } = req.body;
        const usuario = await User.findOne({ where: { user_email } });
        if (!usuario) {
            return res.status(401).send({ error: 'Usuario no encontrado' });
        }
        const match = await bcrypt.compare(user_password, usuario.user_password);
        if (!match) {
            return res.status(401).send({ error: 'Contraseña incorrecta' });
        }
        res.status(200).send({ status: 'Login exitoso', id: usuario.user_id });
    } catch (error) {
        res.status(500).send({ error: 'Error al hacer login' });
    }
};

module.exports = { alta, login };