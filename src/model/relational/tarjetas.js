module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tarjetas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    minuto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    freezeTableName: false,  // Permite que Sequelize pluralice como 'tarjetas'
    timestamps: false        // No se crean campos createdAt y updatedAt
  });
};
