const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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