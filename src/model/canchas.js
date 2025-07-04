const canchas = (sequelize, type) => {
  return sequelize.define('canchas', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: type.STRING,
    direccion: type.STRING,
    tipo: type.STRING // Ej: sintética, natural, indoor
  }, {
    timestamps: false
  });
};

module.exports = canchas;
