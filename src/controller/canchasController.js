// controller/canchasController.js
const { canchas } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await canchas.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener canchas', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const cancha = await canchas.findByPk(req.params.id);
      if (!cancha) return res.status(404).json({ message: 'Cancha no encontrada' });
      res.json(cancha);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar cancha', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newCancha = await canchas.create(req.body);
      res.status(201).json(newCancha);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear cancha', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const cancha = await canchas.findByPk(id);
      if (!cancha) return res.status(404).json({ message: 'Cancha no encontrada' });
      await cancha.update(req.body);
      res.json(cancha);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar cancha', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const cancha = await canchas.findByPk(id);
      if (!cancha) return res.status(404).json({ message: 'Cancha no encontrada' });
      await cancha.destroy();
      res.json({ message: 'Cancha eliminada' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar cancha', error: e.message });
    }
  }
};
