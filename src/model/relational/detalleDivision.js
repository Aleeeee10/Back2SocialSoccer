module.exports = (sequelize, DataTypes) => {
  return sequelize.define('detalleDivision', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'detalleDivisions'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
