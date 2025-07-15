// controller/divisionController.js
const { division } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await division.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener divisiones', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const div = await division.findByPk(req.params.id);
      if (!div) return res.status(404).json({ message: 'División no encontrada' });
      res.json(div);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar división', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newDiv = await division.create(req.body);
      res.status(201).json(newDiv);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear división', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const div = await division.findByPk(id);
      if (!div) return res.status(404).json({ message: 'División no encontrada' });
      await div.update(req.body);
      res.json(div);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar división', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const div = await division.findByPk(id);
      if (!div) return res.status(404).json({ message: 'División no encontrada' });
      await div.destroy();
      res.json({ message: 'División eliminada' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar división', error: e.message });
    }
  }
};
