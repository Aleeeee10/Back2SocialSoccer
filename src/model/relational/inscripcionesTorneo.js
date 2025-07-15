module.exports = (sequelize, DataTypes) => {
  return sequelize.define('inscripcionesTorneo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'pendiente',
      allowNull: false
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'inscripcionesTorneos'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
