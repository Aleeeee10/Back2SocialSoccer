module.exports = (sequelize, DataTypes) => {
  return sequelize.define('estadisticas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
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
      comment: 'Estado de la estadística: true = activa, false = inactiva'
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'estadisticas'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
