// Modelo de referees - Define la estructura de la tabla referees (árbitros)
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('referees', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    experiencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Estado del árbitro: true = activo, false = inactivo'
    }
  }, {
    freezeTableName: false,  // Permite pluralizar el nombre de la tabla a 'referees'
    timestamps: false        // Desactiva createdAt y updatedAt automáticos
  });
};
