// src/model/user.js
const user = (sequelize, type) => {
    return sequelize.define('users', {
        idUsers: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'campo unico Usuario'
        },
        nameUser: {
            type: type.STRING,
            comment: 'nombre del usuario'
        },
        phoneUser: type.STRING,
        emailUser: {
            type: type.STRING,
            unique: true,
            allowNull: false
        },
        usernameUser: type.STRING,
        passwordUser: type.STRING,
        stateUser: type.STRING,
        createUser: type.STRING,
        updateUser: type.STRING,

        // Aquí agregamos la relación con roles
        idRole: {
            type: type.INTEGER,
            allowNull: false,
            comment: 'Clave foránea a roles'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de usuarios',
    });
}

module.exports = user;
