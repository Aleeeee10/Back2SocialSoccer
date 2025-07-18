// Modelo de roles - Define la estructura de la tabla roles
module.exports = (sequelize, types) => {
  return sequelize.define('roles', {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: types.STRING,
      allowNull: false
    },
    descripcion: {
      type: types.STRING,
      allowNull: true
    },
    estado: {
      type: types.STRING,

      allowNull: false,
      comment: 'Estado del rol: true = activo, false = inactivo'
    },
    fecha_creacion: {
      type: types.STRING // Simplificado a tipo STRING
    },
    fecha_modificacion: {
      type: types.STRING // Simplificado a tipo STRING
    }
  }, {
    freezeTableName: false,  // Permite pluralizar el nombre de la tabla a 'roles'
    timestamps: false        // Desactiva createdAt y updatedAt automáticos
  });
};



