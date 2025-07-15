// controller/newsController.js
const { news } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await news.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener noticias', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const newItem = await news.findByPk(req.params.id);
      if (!newItem) return res.status(404).json({ message: 'Noticia no encontrada' });
      res.json(newItem);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar noticia', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newItem = await news.create(req.body);
      res.status(201).json(newItem);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear noticia', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const newItem = await news.findByPk(id);
      if (!newItem) return res.status(404).json({ message: 'Noticia no encontrada' });
      await newItem.update(req.body);
      res.json(newItem);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar noticia', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const newItem = await news.findByPk(id);
      if (!newItem) return res.status(404).json({ message: 'Noticia no encontrada' });
      await newItem.destroy();
      res.json({ message: 'Noticia eliminada' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar noticia', error: e.message });
    }
  }
};
