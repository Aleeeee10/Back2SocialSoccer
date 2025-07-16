module.exports = (sequelize, DataTypes) => {
  return sequelize.define('cancha', {  // singular para que Sequelize pluralice automáticamente
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    nombre: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    ubicacion: { 
      type: DataTypes.STRING, 
      allowNull: true  // explícito que puede ser null
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Campo para eliminación lógica - mantiene consistencia con otros modelos'
    }
  }, {
    freezeTableName: false,  // permite pluralizar la tabla a 'canchas'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
