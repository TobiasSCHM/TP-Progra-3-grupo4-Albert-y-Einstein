const { Sale, Product } = require('../models/index');

const listar = async (req, res, next) => {
    try {
        const ventas = await Sale.findAll({
            include: [{
                model: Product,
                required: true
            }]
        });
        res.status(200).send(ventas);
    } catch (error) {
        res.status(500).send({ error: 'Error al listar ventas' });
    }
};

const alta = async (req, res, next) => {
    try {
        const { sale_customer_name, sale_total, productos } = req.body;
        const venta = await Sale.create({
            sale_customer_name,
            sale_total
        });
        await venta.addProducts(productos);
        res.status(201).send(venta);
    } catch (error) {
        res.status(500).send({ error: 'Error al crear venta' });
    }
};

module.exports = { listar, alta };