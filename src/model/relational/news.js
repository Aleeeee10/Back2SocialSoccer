// Modelo de news - Define la estructura de la tabla news (noticias)
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
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Estado de la noticia: true = activo, false = inactivo'
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'news'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
