module.exports = (sequelize, DataTypes) => {
  return sequelize.define('detalleRol', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'detalleRols'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
