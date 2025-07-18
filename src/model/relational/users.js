module.exports = (sequelize, types) => { //exportar tupes 
  return sequelize.define('users', {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: types.STRING,
      allowNull: false
    },
    email: {
      type: types.STRING,
      allowNull: false,
      unique: true
    },
    contraseña: {
      type: types.STRING,
      allowNull: false
    },
    avatar: {
      type: types.STRING,
      allowNull: true
    },
    estado: {
      type: types.STRING, //el estado no true false, se transofrman  en por ejemplo uso mantenimiento

    },
    fecha_creacion: {
      type: types.STRING // Simplificado a tipo STRING
    },
    fecha_modificacion: {
      type: types.STRING // Simplificado a tipo STRING
    }
  }, {
    freezeTableName: false,  // Permite que Sequelize pluralice como 'users'
    timestamps: false        // No se crean campos createdAt y updatedAt
  });
};
 // no seria string sINO TIPO text 



