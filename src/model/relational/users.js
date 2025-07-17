module.exports = (sequelize, DataTypes) => { //exportar tupes 
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN, //el estado no true false, se transofrman  en por ejemplo uso mantenimiento
      defaultValue: true //Fecha tipo string
    }
  }, {
    freezeTableName: false,  // Permite que Sequelize pluralice como 'users'
    timestamps: false        // No se crean campos createdAt y updatedAt
  });
};
 // no seria string sINO TIPO text 