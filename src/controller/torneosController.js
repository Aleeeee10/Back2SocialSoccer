// controller/torneosController.js
const { torneos } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await torneos.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener torneos', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const torneo = await torneos.findByPk(req.params.id);
      if (!torneo) return res.status(404).json({ message: 'Torneo no encontrado' });
      res.json(torneo);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar torneo', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newTorneo = await torneos.create(req.body);
      res.status(201).json(newTorneo);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear torneo', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const torneo = await torneos.findByPk(id);
      if (!torneo) return res.status(404).json({ message: 'Torneo no encontrado' });
      await torneo.update(req.body);
      res.json(torneo);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar torneo', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const torneo = await torneos.findByPk(id);
      if (!torneo) return res.status(404).json({ message: 'Torneo no encontrado' });
      await torneo.destroy();
      res.json({ message: 'Torneo eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar torneo', error: e.message });
    }
  }
};
