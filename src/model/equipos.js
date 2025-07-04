const equipos = (sequelize, type) => {
  return sequelize.define('teams', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: type.STRING,
    logo_url: type.STRING,
    divisionId: {
      type: type.INTEGER,
      allowNull: false,
      field: 'division'
    }
  }, {
    timestamps: false
  });
};

module.exports = equipos;
