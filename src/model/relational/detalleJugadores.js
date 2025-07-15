module.exports = (sequelize, DataTypes) => {
  return sequelize.define('detalleJugadores', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    biografia: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nacionalidad: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'detalleJugadores'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
