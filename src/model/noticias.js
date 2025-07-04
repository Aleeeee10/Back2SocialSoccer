const noticias = (sequelize, type) => {
  return sequelize.define('news', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: type.STRING,
    description: type.TEXT,
    image_url: type.STRING,
    date: type.DATE
  }, {
    timestamps: false
  });
};

module.exports = noticias;
