const { Product } = require('../models/index');

const listar = async (req, res, next) => {
    try {
        const productos = await Product.findAll({
            where: { product_active: true }
        });
        res.status(200).send(productos);
    } catch (error) {
        res.status(500).send({ error: 'Error al listar productos' });
    }
};

const listarPaginado = async (req, res, next) => {
    try {
        const pagina = req.query.pagina || 1;
        const limite = req.query.limite || 6;
        const offset = (pagina - 1) * limite;
        const productos = await Product.findAndCountAll({
            where: { product_active: true },
            limit: limite,
            offset: offset
        });
        res.status(200).send({
            total: productos.count,
            paginas: Math.ceil(productos.count / limite),
            paginaActual: pagina,
            productos: productos.rows
        });
    } catch (error) {
        res.status(500).send({ error: 'Error al listar productos paginados' });
    }
};

const alta = async (req, res, next) => {
    try {
        const { product_name, product_price, product_description, product_image, product_category } = req.body;
        const producto = await Product.create({
            product_name,
            product_price,
            product_description,
            product_image,
            product_category
        });
        res.status(201).send(producto);
    } catch (error) {
        res.status(500).send({ error: 'Error al crear producto' });
    }
};

const modificar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { product_name, product_price, product_description, product_image, product_category, product_active } = req.body;
        await Product.update(
            { product_name, product_price, product_description, product_image, product_category, product_active },
            { where: { product_id: id } }
        );
        res.status(200).send({ status: 'Producto modificado' });
    } catch (error) {
        res.status(500).send({ error: 'Error al modificar producto' });
    }
};

const baja = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Product.update(
            { product_active: false },
            { where: { product_id: id } }
        );
        res.status(200).send({ status: 'Producto desactivado' });
    } catch (error) {
        res.status(500).send({ error: 'Error al desactivar producto' });
    }
};

module.exports = { listar, listarPaginado, alta, modificar, baja };