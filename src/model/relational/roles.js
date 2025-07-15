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
    }
  }, {
    freezeTableName: false,  // Permite pluralizar el nombre de la tabla a 'roles'
    timestamps: false        // Desactiva createdAt y updatedAt automáticos
  });
};
