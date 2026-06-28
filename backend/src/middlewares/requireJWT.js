// Middleware que protege rutas de la API usando JWT (JSON Web Token),
// en vez de la cookie firmada que usa el panel admin (EJS).
// Se usa para las rutas "crudas" de la API que hoy no tienen ninguna protección
// (alta/modificar/baja de productos, alta de usuarios).
const jwt = require('jsonwebtoken');

const requireJWT = (req, res, next) => {
    // El token viaja en el header Authorization, con el formato: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ error: 'Token no enviado. Mandá el header Authorization: Bearer <token>.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // jwt.verify reconstruye la firma con JWT_SECRET y la compara con la del token.
        // Si no coincide (token editado a mano) o si ya expiró, tira un error.
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Guarda los datos del usuario decodificados del token, por si algún controller los necesita
        req.usuario = payload;
        next();
    } catch (error) {
        return res.status(401).send({ error: 'Token inválido o expirado.' });
    }
};

module.exports = requireJWT;