const detalleDivision = (sequelize, type) => {
  return sequelize.define('detalle_division', {
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
    divisionId: {
      type: type.INTEGER,
      allowNull: false,
      references: {
        model: 'division',
        key: 'id'
      }
    },
    status: type.STRING,
    note: type.TEXT
  }, {
    timestamps: false
  });
};

module.exports = detalleDivision;
