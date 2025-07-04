const detalleEstadisticas = (sequelize, type) => {
  return sequelize.define('detalle_estadisticas', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    playerId: {
      type: type.INTEGER,
      references: {
        model: 'players',
        key: 'id'
      }
    },
    estadisticaId: {
      type: type.INTEGER,
      references: {
        model: 'estadisticas',
        key: 'id'
      }
    },
    valor: type.INTEGER
  }, {
    timestamps: false
  });
};

module.exports = detalleEstadisticas;
