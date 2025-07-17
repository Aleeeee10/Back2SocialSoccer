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
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Campo estado agregado para consistencia con otros modelos
      comment: 'Estado de la división: true = activa, false = inactiva'
    }
  }, {
    freezeTableName: false,  // permite pluralizar el nombre de la tabla a 'divisions'
    timestamps: false        // desactiva createdAt y updatedAt automáticos
  });
};
