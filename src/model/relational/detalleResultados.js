module.exports = (sequelize, DataTypes) => {
  return sequelize.define('detalleResultados', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    resultadoId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    goles: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    asistencias: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
};
