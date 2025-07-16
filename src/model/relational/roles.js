// Modelo de roles - Define la estructura de la tabla roles
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('roles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Estado del rol: true = activo, false = inactivo'
    }
  }, {
    freezeTableName: false,  // Permite pluralizar el nombre de la tabla a 'roles'
    timestamps: false        // Desactiva createdAt y updatedAt automáticos
  });
};
