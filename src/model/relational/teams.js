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
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    freezeTableName: false,  // Permite que Sequelize pluralice como 'teams'
    timestamps: false        // No se crean campos createdAt y updatedAt
  });
};
