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
    winner: type.STRING // 'team1', 'team2' o 'draw'
  }, {
    timestamps: false
  });
};

module.exports = resultados;
