// Importa los modelos de Sale y Product para poder realizar consultas a la base de datos,
// necesita los dos porque las ventas tienen una relación muchos a muchos con los productos
const { Sale, Product } = require('../models/index');

// Función para listar todas las ventas, incluye los productos asociados a cada venta
const listar = async (req, res, next) => {
    try {
        const ventas = await Sale.findAll({
            include: [{ // incluye los productos asociados a cada venta
                model: Product,
                required: true
            }]
        });
        res.status(200).send(ventas); // envía la lista de ventas con sus productos asociados y un código de estado 200 (OK)
    } catch (error) {
        res.status(500).send({ error: 'Error al listar ventas' }); // si hay un error, se envía un mensaje con el código 500 (error del servidor)
    }
};

// Función para crear una nueva venta, recibe el nombre del cliente, el total de la venta y un array de productos con sus cantidades
const alta = async (req, res, next) => {
    try {
        const { sale_customer_name, sale_total, productos } = req.body;
        const venta = await Sale.create({
            sale_customer_name,
            sale_total
        });

        // productos llega como [{ id, cantidad }, ...] desde el frontend.
        // addProducts necesita un array de ids, así que los extraemos por separado
        const ids = productos.map(p => p.id);
        await venta.addProducts(ids);

        res.status(201).send(venta);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al crear venta' });
    }
};

module.exports = { listar, alta };