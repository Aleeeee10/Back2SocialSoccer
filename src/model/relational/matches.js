module.exports = (sequelize, DataTypes) => {
  return sequelize.define('matches', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha: {
      type: DataTypes.DATEONLY,  // solo fecha sin hora
      allowNull: false
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Campo estado agregado para consistencia con otros modelos
      comment: 'Estado del partido: true = activo, false = inactivo'
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'matches'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
