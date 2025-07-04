const resultados = (sequelize, type) => {
  return sequelize.define('resultados', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    matchId: {
      type: type.INTEGER,
      references: {
        model: 'matches',
        key: 'id'
      }
    },
    team1_goals: type.INTEGER,
    team2_goals: type.INTEGER,
    winner: type.STRING // puede ser "Team 1", "Team 2" o "Empate"
  }, {
    timestamps: false
  });
};

module.exports = resultados;
