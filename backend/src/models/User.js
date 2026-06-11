// Importa DataTypes de Sequelize para definir los tipos de datos de los campos
// y la instancia de Sequelize para conectar con la base de datos
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

// Define el modelo User con los campos user_id, user_email y user_password
const User = sequelize.define(
    'User',
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        user_password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    { freezeTableName: true }
);

module.exports = User;