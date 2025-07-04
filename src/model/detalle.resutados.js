const detalleResultados = (sequelize, type) => {
  return sequelize.define('detalle_resultados', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    resultadoId: {
      type: type.INTEGER,
      references: {
        model: 'resultados',
        key: 'id'
      }
    },
    playerId: {
      type: type.INTEGER,
      references: {
        model: 'players',
        key: 'id'
      }
    },
    goles: {
      type: type.INTEGER,
      defaultValue: 0
    },
    asistencia: {
      type: type.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: false
  });
};

module.exports = detalleResultados;
