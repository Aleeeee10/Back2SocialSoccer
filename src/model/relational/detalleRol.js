module.exports = (sequelize, DataTypes) => {
  return sequelize.define('detalleRol', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Campo estado agregado para consistencia con otros modelos
      comment: 'Estado del detalle rol: true = activo, false = inactivo'
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'detalleRols'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
