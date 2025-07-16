// Modelo de posiciones - Define la estructura de la tabla posiciones (tabla de puntuaciones)
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('posiciones', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    puntos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    partidosJugados: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    partidosGanados: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    partidosEmpatados: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    partidosPerdidos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Estado de la posición: true = activo, false = inactivo'
    }
  }, {
    freezeTableName: false,  // Permite pluralizar el nombre de la tabla a 'posiciones'
    timestamps: false        // Desactiva createdAt y updatedAt automáticos
  });
};
