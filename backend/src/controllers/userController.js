// Importa el modelo de User para poder realizar consultas a la base de datos y bcrypt para encriptar las contraseñas
const { User } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Función para crear un nuevo usuario, recibe el email y la contraseña
const alta = async (req, res, next) => {
    try {
        const { user_email, user_password } = req.body;
        const hash = await bcrypt.hash(user_password, 10); // encripta la contraseña utilizando bcrypt con un salt de 10

        // Crea un nuevo usuario en la base de datos con el email y la contraseña encriptada
        const usuario = await User.create({
            user_email,
            user_password: hash
        });
        res.status(201).send({ status: 'Usuario creado', id: usuario.user_id }); // envía un mensaje de éxito con el id del usuario creado y un código de estado 201 (creado)
    } catch (error) {
        res.status(500).send({ error: 'Error al crear usuario' }); // si hay un error, se envía un mensaje con el código 500 (error del servidor)
    }
};

// Función para hacer login, recibe el email y la contraseña, verifica que el usuario exista y que la contraseña sea correcta
const login = async (req, res, next) => {
    try {
        const { user_email, user_password } = req.body;
        const usuario = await User.findOne({ where: { user_email } }); // busca un usuario en la base de datos con el email recibido
        if (!usuario) {
            return res.status(401).send({ error: 'Usuario no encontrado' }); // si no se encuentra el usuario, se envía un mensaje de error con un código de estado 401 (no autorizado)
        }
        const match = await bcrypt.compare(user_password, usuario.user_password); // compara la contraseña recibida con la contraseña encriptada almacenada
        if (!match) {
            return res.status(401).send({ error: 'Contraseña incorrecta' });
        }

        // Genera un JWT con el id y el email del usuario adentro (el "payload"), firmado con JWT_SECRET.
        // Este token es lo que el cliente de la API va a tener que mandar en cada request protegido,
        // en el header Authorization: Bearer <token>
        const token = jwt.sign(
            { id: usuario.user_id, email: usuario.user_email },
            process.env.JWT_SECRET,
            { expiresIn: '4h' } // mismo tiempo de vida que la cookie del panel admin
        );

        res.status(200).send({ status: 'Login exitoso', id: usuario.user_id, token });
    } catch (error) {
        res.status(500).send({ error: 'Error al hacer login' });
    }
}

module.exports = { alta, login };