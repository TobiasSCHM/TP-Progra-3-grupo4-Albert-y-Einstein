// Script de "seed" — carga productos de ejemplo en la base de datos.
// Se ejecuta a mano una sola vez (o cada vez que se quiera repoblar) con: node src/seed.js
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./database');
const { Product } = require('./models/index');

// Lista de productos de ejemplo, repartidos entre las dos categorías del frontend
const productosEjemplo = [
    {
        product_name: 'Fender Stratocaster',
        product_price: 850000,
        product_description: 'Guitarra eléctrica clásica, cuerpo de aliso y mástil de arce.',
        product_image: null,
        product_category: 'Guitarras'
    },
    {
        product_name: 'Gibson Les Paul Studio',
        product_price: 1200000,
        product_description: 'Guitarra eléctrica de cuerpo macizo con sonido cálido y potente.',
        product_image: null,
        product_category: 'Guitarras'
    },
    {
        product_name: 'Ibanez RG550',
        product_price: 690000,
        product_description: 'Guitarra eléctrica versátil, ideal para géneros de alta exigencia técnica.',
        product_image: null,
        product_category: 'Guitarras'
    },
    {
        product_name: 'Yamaha Pacifica 112V',
        product_price: 430000,
        product_description: 'Guitarra eléctrica de entrada gama media, muy versátil.',
        product_image: null,
        product_category: 'Guitarras'
    },
    {
        product_name: 'Fender Precision Bass',
        product_price: 950000,
        product_description: 'Bajo eléctrico de 4 cuerdas, sonido grueso y definido.',
        product_image: null,
        product_category: 'Bajos'
    },
    {
        product_name: 'Ibanez SR300E',
        product_price: 520000,
        product_description: 'Bajo eléctrico moderno con electrónica activa.',
        product_image: null,
        product_category: 'Bajos'
    },
    {
        product_name: 'Yamaha TRBX304',
        product_price: 480000,
        product_description: 'Bajo eléctrico de 4 cuerdas con gran proyección de sonido.',
        product_image: null,
        product_category: 'Bajos'
    },
    {
        product_name: 'Squier Affinity Jazz Bass',
        product_price: 390000,
        product_description: 'Bajo eléctrico ideal para principiantes con sonido profesional.',
        product_image: null,
        product_category: 'Bajos'
    }
];

// Función principal que conecta a la BD, borra productos viejos del seed y carga los nuevos
async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa');

        for (const producto of productosEjemplo) {
            await Product.create(producto);
        }

        console.log(`${productosEjemplo.length} productos cargados correctamente.`);
    } catch (error) {
        console.error('Error al cargar productos de ejemplo:', error);
    } finally {
        await sequelize.close();
    }
}

seed();