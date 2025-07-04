const orm = require('../dataBase/dataBase.orm');
const newsController = {};

newsController.listar = async (req, res) => {
  try {
    const noticias = await orm.news.findAll();
    res.json(noticias);
  } catch (error) {
    console.error('Error al listar noticias:', error);
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
};

newsController.crear = async (req, res) => {
  try {
    const { title, description, image_url, date } = req.body;
    const nueva = await orm.news.create({ title, description, image_url, date });
    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al crear noticia:', error);
    res.status(500).json({ error: 'Error al crear noticia' });
  }
};

newsController.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, date } = req.body;
    await orm.news.update(
      { title, description, image_url, date },
      { where: { id } }
    );
    res.json({ mensaje: 'Noticia actualizada' });
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    res.status(500).json({ error: 'Error al actualizar noticia' });
  }
};

newsController.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.news.destroy({ where: { id } });
    res.json({ mensaje: 'Noticia eliminada' });
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    res.status(500).json({ error: 'Error al eliminar noticia' });
  }
};

module.exports = newsController;
