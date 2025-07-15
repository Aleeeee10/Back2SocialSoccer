// controller/comentariosController.js
const { comentarios } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await comentarios.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener comentarios', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const comment = await comentarios.findByPk(req.params.id);
      if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });
      res.json(comment);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar comentario', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newComment = await comentarios.create(req.body);
      res.status(201).json(newComment);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear comentario', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const comment = await comentarios.findByPk(id);
      if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });
      await comment.update(req.body);
      res.json(comment);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar comentario', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const comment = await comentarios.findByPk(id);
      if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });
      await comment.destroy();
      res.json({ message: 'Comentario eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar comentario', error: e.message });
    }
  }
};
