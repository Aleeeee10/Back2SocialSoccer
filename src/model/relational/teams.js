module.exports = (sequelize, DataTypes) => {
  return sequelize.define('teams', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    entrenador: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: false,  // Permite pluralizar el nombre de la tabla
    timestamps: false        // Desactiva createdAt y updatedAt automáticos
  });
};
