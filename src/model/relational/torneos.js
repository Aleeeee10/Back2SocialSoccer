module.exports = (sequelize, DataTypes) => {
  return sequelize.define('torneos', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fechaFin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    freezeTableName: false,  // Permite pluralizar a 'torneoses' (si aplica)
    timestamps: false        // No agrega createdAt ni updatedAt
  });
};
