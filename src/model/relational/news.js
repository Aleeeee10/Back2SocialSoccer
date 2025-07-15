module.exports = (sequelize, DataTypes) => {
  return sequelize.define('news', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'news'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
