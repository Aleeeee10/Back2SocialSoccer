const arbitros = (sequelize, type) => {
  return sequelize.define('referees', {
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: type.STRING,
    photo_url: type.STRING,
    nationality: type.STRING,
    age: type.INTEGER
  }, {
    timestamps: false
  });
};

module.exports = arbitros;
