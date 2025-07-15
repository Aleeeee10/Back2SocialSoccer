module.exports = (sequelize, DataTypes) => {
  return sequelize.define('division', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'divisions'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
