// controller/matchesController.js
const { matches } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await matches.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener partidos', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const match = await matches.findByPk(req.params.id);
      if (!match) return res.status(404).json({ message: 'Partido no encontrado' });
      res.json(match);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar partido', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newMatch = await matches.create(req.body);
      res.status(201).json(newMatch);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear partido', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const match = await matches.findByPk(id);
      if (!match) return res.status(404).json({ message: 'Partido no encontrado' });
      await match.update(req.body);
      res.json(match);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar partido', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const match = await matches.findByPk(id);
      if (!match) return res.status(404).json({ message: 'Partido no encontrado' });
      await match.destroy();
      res.json({ message: 'Partido eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar partido', error: e.message });
    }
  }
};
