const standings = (sequelize, type) => {
  return sequelize.define('standings', {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    teamId: { type: type.INTEGER, allowNull: false },
    games_played: type.INTEGER,
    wins: type.INTEGER,
    draws: type.INTEGER,
    losses: type.INTEGER,
    goals_for: type.INTEGER,
    goals_against: type.INTEGER,
    points: type.INTEGER
  }, { timestamps: false });
};

module.exports = standings;
