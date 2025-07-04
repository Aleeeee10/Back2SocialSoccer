const posiciones = (sequelize, type) => {
  return sequelize.define('standings', {
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    teamId: {
      type: type.INTEGER,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    divisionId: {
      type: type.INTEGER,
      references: {
        model: 'division',
        key: 'id'
      }
    },
    games_played: {
      type: type.INTEGER,
      defaultValue: 0
    },
    wins: {
      type: type.INTEGER,
      defaultValue: 0
    },
    losses: {
      type: type.INTEGER,
      defaultValue: 0
    },
    draws: {
      type: type.INTEGER,
      defaultValue: 0
    },
    goals_for: {
      type: type.INTEGER,
      defaultValue: 0
    },
    goals_against: {
      type: type.INTEGER,
      defaultValue: 0
    },
    points: {
      type: type.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: false
  });
};

module.exports = posiciones;
