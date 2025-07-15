module.exports = (sequelize, DataTypes) => {
  return sequelize.define('comentario', {  // modelo en singular para que Sequelize pluralice
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entidadId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    autorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    creadoEn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    freezeTableName: false,  // permite pluralizar la tabla a 'comentarios'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
