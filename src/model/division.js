const division = (sequelize, type) => {
  return sequelize.define('division', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: type.STRING,
    description: type.TEXT,
  }, {
    timestamps: false,
    tableName: 'division'  // <-- Fija el nombre exacto
  });
};

module.exports = division;
