const detalleJugadores = (sequelize, type) => {
  return sequelize.define('detalle_jugadores', {
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
    edad: type.INTEGER,
    estatura: type.FLOAT,
    peso: type.FLOAT,
    categoria: type.STRING
  }, {
    timestamps: false
  });
};

module.exports = detalleJugadores;
