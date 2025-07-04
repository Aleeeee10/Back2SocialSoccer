const rol = (sequelize, type) => {
    return sequelize.define('roles', {
        idRoles: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'el id de tabla de roles'
        },
        nameRole: {
            type: type.STRING,
            comment: 'nombre del rol'
        },
        descriptionRole: {
            type: type.STRING,
            comment: 'descripción del rol'
        },
        stateRole: {
            type: type.STRING,
            comment: 'estado del rol'
        },
        createRole: {
            type: type.STRING,
            comment: 'fecha de creación del rol'
        },
        updateRole: {
            type: type.STRING,
            comment: 'fecha de actualización del rol'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de roles',
    });
}

module.exports = rol;