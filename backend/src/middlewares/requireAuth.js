// Middleware que protege las rutas del panel de administrador.
// Revisa si existe la cookie firmada "admin_session"; si no está,
// redirige al login en vez de dejar pasar la petición.

const requireAuth = (req, res, next) => {
    if (req.signedCookies && req.signedCookies.admin_session) {
        return next();
    }
    res.redirect('/admin/login');
};

module.exports = requireAuth;