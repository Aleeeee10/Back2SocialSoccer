// Modelo de players - Define la estructura de la tabla players (jugadores)
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('players', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    posicion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dorsal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Estado del jugador: true = activo, false = inactivo'
    }
  }, {
    freezeTableName: false,  // Permite pluralizar el nombre de la tabla a 'players'
    timestamps: false        // Desactiva createdAt y updatedAt automáticos
  });
};
