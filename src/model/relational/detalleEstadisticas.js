module.exports = (sequelize, DataTypes) => {
  return sequelize.define('detalleEstadisticas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
