// Modelo de resultados - Define la estructura de la tabla resultados
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
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Estado del resultado: true = activo, false = inactivo'
    }
  }, {
    freezeTableName: false,  // Permite pluralizar el nombre de la tabla a 'resultados'
    timestamps: false        // Desactiva createdAt y updatedAt automáticos
  });
};
