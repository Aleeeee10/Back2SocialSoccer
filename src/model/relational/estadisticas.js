module.exports = (sequelize, DataTypes) => {
  return sequelize.define('estadisticas', {
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
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'estadisticas'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
