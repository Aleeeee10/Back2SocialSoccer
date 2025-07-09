const equipos = (sequelize, type) => {
  return sequelize.define('teams', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: type.STRING,
    logo_url: type.STRING,
    division: { // <-- así debe llamarse si tu columna es division
      type: type.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });
};

module.exports = equipos;
