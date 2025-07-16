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
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Campo estado agregado para consistencia con otros modelos
      comment: 'Estado del detalle jugador: true = activo, false = inactivo'
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'detalleJugadores'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
