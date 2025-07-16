module.exports = (sequelize, DataTypes) => {
  return sequelize.define('detalleResultados', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    resultadoId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: true
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
      comment: 'Estado del detalle resultado: true = activo, false = inactivo'
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
};
