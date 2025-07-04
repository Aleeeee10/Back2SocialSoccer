const tarjetas = (sequelize, type) => {
  return sequelize.define('tarjetas', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    playerId: {
      type: type.INTEGER,
      allowNull: false,
      references: {
        model: 'players',
        key: 'id'
      }
    },
    matchId: {
      type: type.INTEGER,
      allowNull: false,
      references: {
        model: 'matches',
        key: 'id'
      }
    },
    tipo: {
      type: type.ENUM('amarilla', 'roja'),
      allowNull: false
    },
    minuto: {
      type: type.INTEGER
    }
  }, {
    timestamps: false
  });
};

module.exports = tarjetas;
