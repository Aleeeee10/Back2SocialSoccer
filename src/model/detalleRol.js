const detalleRol = (sequelize, DataTypes) => {
    return sequelize.define('detalleRoles', {
        idDetalleRol: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'el id de tabla de detalle de roles'
        },
        idRoles: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'id del rol asociado'
        },
        idUsers: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'id del usuario asociado'
        },
        createDetalleRol: {
            type: DataTypes.STRING,
            comment: 'fecha de creación del detalle de rol'
        },
        updateDetalleRol: {
            type: DataTypes.STRING,
            comment: 'fecha de actualización del detalle de rol'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de detalle de roles',
    });
}

module.exports = detalleRol;