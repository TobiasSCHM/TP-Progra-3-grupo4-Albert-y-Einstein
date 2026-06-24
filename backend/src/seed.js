// Script de "seed" — carga productos de ejemplo en la base de datos.
// Se ejecuta a mano una sola vez (o cada vez que se quiera repoblar) con: node src/seed.js
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./database');
const { Product } = require('./models/index');

// Lista de productos de ejemplo, repartidos entre las dos categorías del frontend
const productosEjemplo = [
    // ===== GUITARRAS =====
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
        product_name: 'PRS SE Custom 24',
        product_price: 980000,
        product_description: 'Guitarra eléctrica con doble cutaway y mástil tipo wide-thin.',
        product_image: null,
        product_category: 'Guitarras'
    },
    {
        product_name: 'Gretsch G5420T',
        product_price: 1100000,
        product_description: 'Guitarra hollow body, sonido cálido típico del rockabilly.',
        product_image: null,
        product_category: 'Guitarras'
    },
    {
        product_name: 'Epiphone Les Paul Standard',
        product_price: 620000,
        product_description: 'Versión más accesible del clásico Les Paul, gran calidad de construcción.',
        product_image: null,
        product_category: 'Guitarras'
    },
    {
        product_name: 'Jackson JS32 Dinky',
        product_price: 540000,
        product_description: 'Guitarra eléctrica orientada a metal, mástil delgado para solos rápidos.',
        product_image: null,
        product_category: 'Guitarras'
    },
    {
        product_name: 'Taylor 214ce (acústica)',
        product_price: 1450000,
        product_description: 'Guitarra acústica electrificada, tapa de cedro macizo.',
        product_image: null,
        product_category: 'Guitarras'
    },
    {
        product_name: 'Yamaha FG830 (acústica)',
        product_price: 380000,
        product_description: 'Guitarra acústica de entrada, tapa maciza de palo de rosa.',
        product_image: null,
        product_category: 'Guitarras'
    },

    // ===== BAJOS =====
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
    },
    {
        product_name: 'Music Man StingRay',
        product_price: 1650000,
        product_description: 'Bajo eléctrico icónico, sonido punchy gracias a su pickup humbucker.',
        product_image: null,
        product_category: 'Bajos'
    },
    {
        product_name: 'Spector Performer 4',
        product_price: 600000,
        product_description: 'Bajo de cuerpo tipo "wing" con gran comodidad para tocar sentado o de pie.',
        product_image: null,
        product_category: 'Bajos'
    },
    {
        product_name: 'Ibanez GSR200',
        product_price: 350000,
        product_description: 'Bajo eléctrico liviano, ideal para principiantes.',
        product_image: null,
        product_category: 'Bajos'
    },
    {
        product_name: 'Fender Jazz Bass American Performer',
        product_price: 1380000,
        product_description: 'Bajo de 4 cuerdas con doble pickup, gran versatilidad tonal.',
        product_image: null,
        product_category: 'Bajos'
    },
    {
        product_name: 'Cort Action Bass Plus',
        product_price: 410000,
        product_description: 'Bajo eléctrico de 4 cuerdas con preamplificador activo de 2 bandas.',
        product_image: null,
        product_category: 'Bajos'
    },
    {
        product_name: 'Schecter Stiletto Stealth-4',
        product_price: 720000,
        product_description: 'Bajo eléctrico orientado a géneros pesados, sonido grave y agresivo.',
        product_image: null,
        product_category: 'Bajos'
    }
];

// Función principal que conecta a la BD, borra productos viejos del seed y carga los nuevos
async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa');

        // Borra todos los productos existentes antes de cargar los nuevos
        await Product.destroy({ where: {}, truncate: true, cascade: true });
        console.log('Productos anteriores eliminados');

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