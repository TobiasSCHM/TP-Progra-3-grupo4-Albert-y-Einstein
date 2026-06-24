// Importa Express y crea un Router exclusivo para las vistas del panel de administrador
const express = require('express');
const adminViewRoutes = express.Router();
const { User, Product, Sale } = require('../models/index');
const bcrypt = require('bcrypt');
const upload = require('../middlewares/upload');
const requireAuth = require('../middlewares/requireAuth');

 
// Muestra el formulario de login
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
 
        // Cookie firmada: guarda el id del usuario, expira a las 4hs.
        // signed: true hace que viaje firmada con COOKIE_SECRET, así
        // si alguien la edita a mano en el navegador, Express la invalida.
        res.cookie('admin_session', usuario.user_id, {
            httpOnly: true,       // no accesible desde JS del navegador
            signed: true,         // firmada con COOKIE_SECRET (evita manipulación)
            maxAge: 4 * 60 * 60 * 1000 // 4 horas
        });
 
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.render('login', { error: 'Error al iniciar sesión' });
    }
});
 
// Cierra la sesión del admin
adminViewRoutes.post('/logout', (req, res) => {
    res.clearCookie('admin_session');
    res.redirect('/admin/login');
});
 
// ============================================================
//  A PARTIR DE ACÁ, TODO REQUIERE ESTAR LOGUEADO
// ============================================================
adminViewRoutes.use(requireAuth);
 

adminViewRoutes.get('/dashboard', async (req, res) => {
    try {
        const productos = await Product.findAll();
        const ventas = await Sale.findAll({
            include: Product,
            order: [['sale_date', 'DESC']],
            limit: 10
        });

        const productosPorCategoria = {};
        productos.forEach(producto => {
            const categoria = producto.product_category;
            if (!productosPorCategoria[categoria]) {
                productosPorCategoria[categoria] = [];
            }
            productosPorCategoria[categoria].push(producto);
        });

        res.render('dashboard', { productosPorCategoria, ventas });
    } catch (error) {
        res.render('dashboard', { productosPorCategoria: {}, ventas: [], errorCarga: 'No se pudieron cargar los datos del panel.' });
    }
});
 

 
// Muestra el formulario de alta
adminViewRoutes.get('/productos/nuevo', (req, res) => {
    res.render('addProduct');
});
 
// Procesa el alta de un producto nuevo
adminViewRoutes.post('/productos/nuevo', upload.single('product_image'), async (req, res) => {
    try {
        const { product_name, product_price, product_description, product_category } = req.body;
        const errores = [];
 
        if (!product_name || product_name.trim() === '') errores.push('El nombre es obligatorio.');
        if (!product_price || isNaN(product_price) || Number(product_price) <= 0) errores.push('El precio debe ser un número mayor a 0.');
        if (!product_description || product_description.trim() === '') errores.push('La descripción es obligatoria.');
        if (!product_category || product_category.trim() === '') errores.push('La categoría es obligatoria.');
 
        if (errores.length > 0) {
            return res.render('addProduct', { errores, datos: req.body });
        }
 
        const product_image = req.file ? `/uploads/${req.file.filename}` : null;
 
        await Product.create({
            product_name,
            product_price,
            product_description,
            product_image,
            product_category
        });
 
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.render('addProduct', { error: 'Error al crear el producto.', datos: req.body });
    }
});
 

 
// Muestra el formulario de edición precargado
adminViewRoutes.get('/productos/:id/editar', async (req, res) => {
    try {
        const producto = await Product.findByPk(req.params.id);
        if (!producto) {
            return res.redirect('/admin/dashboard');
        }
        res.render('editProduct', { producto });
    } catch (error) {
        res.redirect('/admin/dashboard');
    }
});
 
// Procesa la edición de un producto existente
adminViewRoutes.post('/productos/:id/editar', upload.single('product_image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, product_price, product_description, product_category } = req.body;
        const product_active = req.body.product_active === 'true';
        const errores = [];
 
        if (!product_name || product_name.trim() === '') errores.push('El nombre es obligatorio.');
        if (!product_price || isNaN(product_price) || Number(product_price) <= 0) errores.push('El precio debe ser un número mayor a 0.');
        if (!product_description || product_description.trim() === '') errores.push('La descripción es obligatoria.');
        if (!product_category || product_category.trim() === '') errores.push('La categoría es obligatoria.');
 
        if (errores.length > 0) {
            const productoActual = await Product.findByPk(id);
            return res.render('editProduct', { errores, producto: { ...productoActual.toJSON(), ...req.body, product_id: id } });
        }
 
        const datosActualizados = { product_name, product_price, product_description, product_category, product_active };
 
        // Solo se reemplaza la imagen si se subió una nueva
        if (req.file) {
            datosActualizados.product_image = `/uploads/${req.file.filename}`;
        }
 
        await Product.update(datosActualizados, { where: { product_id: id } });
 
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.redirect('/admin/dashboard');
    }
});
 

 
adminViewRoutes.post('/productos/:id/baja', async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Product.findByPk(id);
        if (producto) {
            await Product.update(
                { product_active: !producto.product_active },
                { where: { product_id: id } }
            );
        }
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.redirect('/admin/dashboard');
    }
});
 
module.exports = { adminViewRoutes };