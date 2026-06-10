const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { productRoutes } = require('./src/routes/productRoutes');
const { saleRoutes } = require('./src/routes/saleRoutes');
const { userRoutes } = require('./src/routes/userRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/product', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/users', userRoutes);

const sequelize = require('./src/database');
const { User, Product, Sale } = require('./src/models/index');

sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos exitosa');
        return sequelize.sync({ alter: true });
    })
    .then(() => console.log('Tablas sincronizadas'))
    .catch((err) => console.error('Error:', err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;