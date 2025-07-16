module.exports = (sequelize, DataTypes) => {
  return sequelize.define('detalleDivision', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Campo para eliminación lógica - mantiene consistencia con otros modelos'
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'detalleDivisions'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
