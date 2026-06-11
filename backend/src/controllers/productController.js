// Importa el modelo Product para poder hacer consultas a la tabla de productos
const { Product } = require('../models/index');

// Controlador para listar todos los productos activos
const listar = async (req, res, next) => {
    try {
        const productos = await Product.findAll({ // findAll trae todos los registros de la tabla
            where: { product_active: true }       // el where solo trae los productos que están activos (product_active = true)
        });
        res.status(200).send(productos); // envía la lista de productos activos con un código de estado 200 (OK)
    } catch (error) {
        res.status(500).send({ error: 'Error al listar productos' }); // si hay un error, se envía un mensaje con el código 500 (error del servidor)
    }
};

// Controlador para listar productos paginados
const listarPaginado = async (req, res, next) => {
    try {
        // req.query.pagina lee el parámetro de la URL para la página actual, si no se proporciona, se establece en 1 por defecto
        const pagina = req.query.pagina || 1;
        const limite = req.query.limite || 6;
        const offset = (pagina - 1) * limite; // calcula cuántos registros saltear
        const productos = await Product.findAndCountAll({ // trae los productos y el total de registros que cumplen la condición
            where: { product_active: true },
            limit: limite,
            offset: offset
        });
        // envía la respuesta con el total de productos, el número de páginas, la página actual y los productos de la página solicitada
        res.status(200).send({
            total: productos.count,
            paginas: Math.ceil(productos.count / limite),
            paginaActual: pagina,
            productos: productos.rows
        });
    // si hay un error, se envía un mensaje con el código 500 (error del servidor)    
    } catch (error) {
        res.status(500).send({ error: 'Error al listar productos paginados' });
    }
};

// Lee los datos del body de la petición y crea un nuevo registro en la tabla
const alta = async (req, res, next) => {
    try {
        const { product_name, product_price, product_description, product_category } = req.body;

        // Si se subió una imagen, se guarda la ruta en product_image, si no, se toma el valor del body o se establece como null
        const product_image = req.file
            ? `/uploads/${req.file.filename}`
            : req.body.product_image || null;

        // Crea un nuevo producto en la base de datos con los datos recibidos    
        const producto = await Product.create({
            product_name,
            product_price,
            product_description,
            product_image,
            product_category
        });
        res.status(201).send(producto); // envía el producto creado con un código de estado 201 (creado)
    } catch (error) {
        res.status(500).send({ error: 'Error al crear producto' }); // si hay un error, se envía un mensaje con el código 500 (error del servidor)
    }
};

// Lee los datos del body de la petición y actualiza el registro correspondiente en la tabla
const modificar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { product_name, product_price, product_description, product_category, product_active } = req.body;

        // Si se subió una imagen, se guarda la ruta en product_image, si no, se toma el valor del body o se mantiene la imagen actual
        const product_image = req.file
            ? `/uploads/${req.file.filename}`
            : req.body.product_image;

        // Actualiza el producto en la base de datos con los datos recibidos, buscando por el id del producto    
        await Product.update(
            { product_name, product_price, product_description, product_image, product_category, product_active },
            { where: { product_id: id } }
        );
        res.status(200).send({ status: 'Producto modificado' }); // envía un mensaje de éxito con un código de estado 200 (OK)
    } catch (error) {
        res.status(500).send({ error: 'Error al modificar producto' }); // si hay un error, se envía un mensaje con el código 500 (error del servidor)
    }
};

// Actualiza el campo product_active a false para "eliminar" el producto sin borrarlo físicamente de la base de datos
const baja = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Product.update(
            { product_active: false },
            { where: { product_id: id } }
        );
        res.status(200).send({ status: 'Producto desactivado' }); // envía un mensaje de éxito con un código de estado 200 (OK)
    } catch (error) {
        res.status(500).send({ error: 'Error al desactivar producto' });
    }
};

module.exports = { listar, listarPaginado, alta, modificar, baja };