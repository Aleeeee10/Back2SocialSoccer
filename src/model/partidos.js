const partidos = (sequelize, type) => {
  return sequelize.define('matches', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: type.DATE,
    hour: type.STRING,
    location: type.STRING,
    team1Id: {
      type: type.INTEGER,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    team2Id: {
      type: type.INTEGER,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    refereeId: {
      type: type.INTEGER,
      references: {
        model: 'referees',
        key: 'id'
      }
    }
  }, {
    timestamps: false
  });
};

module.exports = partidos;
