module.exports = (sequelize, DataTypes) => {
  return sequelize.define('referees', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    experiencia: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: false,  // Permite pluralizar el nombre de la tabla a 'referees'
    timestamps: false        // Desactiva createdAt y updatedAt automáticos
  });
};
