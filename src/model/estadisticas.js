const estadisticas = (sequelize, type) => {
  return sequelize.define('estadisticas', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: type.STRING,
    descripcion: type.TEXT
  }, {
    timestamps: false
  });
};

module.exports = estadisticas;
