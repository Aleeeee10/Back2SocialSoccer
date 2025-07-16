module.exports = (sequelize, DataTypes) => {
  return sequelize.define('inscripcionesTorneo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Campo estado modificado para consistencia con otros modelos
      comment: 'Estado de la inscripción: true = activa, false = inactiva'
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'inscripcionesTorneos'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
