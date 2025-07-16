module.exports = (sequelize, DataTypes) => {
  return sequelize.define('agendaEntrenamiento', {  // singular para que Sequelize pluralice automáticamente
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    fecha: { 
      type: DataTypes.DATEONLY,  // solo fecha sin hora
      allowNull: false 
    },
    hora: { 
      type: DataTypes.TIME, 
      allowNull: false 
    },
    descripcion: { 
      type: DataTypes.STRING, 
      allowNull: true  // mejor explicitar si puede ser null o no
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Campo para eliminación lógica - mantiene consistencia con otros modelos'
    }
  }, {
    freezeTableName: false, // Sequelize pluralizará "agendaEntrenamientos" para la tabla
    timestamps: false       // desactiva createdAt y updatedAt automáticos
  });
};
