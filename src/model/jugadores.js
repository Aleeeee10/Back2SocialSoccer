const jugadores = (sequelize, type) => {
  return sequelize.define('players', {
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: type.STRING,
    photo_url: type.STRING,
    number: type.INTEGER,
    position: type.STRING,
    goals: {
      type: type.INTEGER,
      defaultValue: 0
    },
    yellow_cards: {
      type: type.INTEGER,
      defaultValue: 0
    },
    red_cards: {
      type: type.INTEGER,
      defaultValue: 0
    },
    teamId: {
      type: type.INTEGER,
      allowNull: true,
      references: {
        model: 'teams',
        key: 'id'
      }
    }
  }, {
    timestamps: false
  });
};

module.exports = jugadores;
