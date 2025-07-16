module.exports = (sequelize, DataTypes) => {
  return sequelize.define('detalleEstadisticas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    goles: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    asistencias: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Campo estado agregado para consistencia con otros modelos
      comment: 'Estado del detalle estadística: true = activo, false = inactivo'
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
};
