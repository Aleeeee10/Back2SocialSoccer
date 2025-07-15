module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tarjetas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    minuto: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    freezeTableName: false,  // Permite pluralizar el nombre de la tabla
    timestamps: false        // Desactiva createdAt y updatedAt automáticos
  });
};
