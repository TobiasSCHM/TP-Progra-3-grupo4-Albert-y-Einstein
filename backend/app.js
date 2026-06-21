// Carga las variables del archivo .env
const dotenv = require('dotenv');
dotenv.config();

// Importa los módulos necesarios
const express = require('express');
const cors = require('cors');
const path = require('path');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');

// Crea la aplicación Express
const app = express();

// Configura middlewares para parsear JSON, cookies firmadas y manejar CORS
app.use(express.json()); // Entiende peticiones con datos en formato JSON
app.use(express.urlencoded({ extended: true })); // Entiende peticiones con datos en formato URL-encoded
app.use(cookieParser(process.env.COOKIE_SECRET)); // Lee cookies, y las firmadas con el secreto del .env
app.use(cors()); // Permite solicitudes desde cualquier origen
app.set('view engine', 'ejs'); // Configura EJS como el motor de plantillas para renderizar vistas
app.set('views', path.join(__dirname, 'src/views')); // Configura la ruta para las vistas de EJS

// Configura la ruta para servir archivos estáticos (imágenes, CSS, etc.) desde la carpeta 'public'
app.use('/uploads', express.static(path.join(__dirname, 'src/public/uploads')));
app.use('/css', express.static(path.join(__dirname, 'src/public/css')));
app.use('/images', express.static(path.join(__dirname, 'src/public/images')));

// Importa las rutas de cada módulo y las registra en la app
const { productRoutes } = require('./src/routes/productRoutes'); 
const { saleRoutes } = require('./src/routes/saleRoutes');
const { userRoutes } = require('./src/routes/userRoutes');
const { adminViewRoutes } = require('./src/routes/adminViewRoutes');

// Configura las rutas de la API
app.use('/api/product', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/users', userRoutes);
app.use('/admin', adminViewRoutes);

// Importa la configuración de Sequelize y los modelos de la base de datos
const sequelize = require('./src/database');
const { User, Product, Sale } = require('./src/models/index');

// Autentica la conexión a la base de datos y sincroniza los modelos
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos exitosa');
        return sequelize.sync({ alter: true }); // Crea o actualiza las tablas automáticamente según los modelos, sin borrar los datos existentes
    })
    .then(() => console.log('Tablas sincronizadas'))
    .catch((err) => console.error('Error:', err));

// Inicia el servidor en el puerto especificado o en el puerto 3000 por defecto    
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Exporta la aplicación para que pueda ser utilizada en otros archivos
module.exports = app;