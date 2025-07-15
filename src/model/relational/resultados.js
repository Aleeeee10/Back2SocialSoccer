module.exports = (sequelize, DataTypes) => {
  return sequelize.define('resultados', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    marcadorLocal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    marcadorVisitante: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    freezeTableName: false,  // Permite pluralizar el nombre de la tabla a 'resultados'
    timestamps: false        // Desactiva createdAt y updatedAt automáticos
  });
};
