// controller/estadisticasController.js
const { estadisticas } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await estadisticas.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener estadísticas', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const est = await estadisticas.findByPk(req.params.id);
      if (!est) return res.status(404).json({ message: 'Estadística no encontrada' });
      res.json(est);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar estadística', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newEst = await estadisticas.create(req.body);
      res.status(201).json(newEst);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear estadística', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const est = await estadisticas.findByPk(id);
      if (!est) return res.status(404).json({ message: 'Estadística no encontrada' });
      await est.update(req.body);
      res.json(est);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar estadística', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const est = await estadisticas.findByPk(id);
      if (!est) return res.status(404).json({ message: 'Estadística no encontrada' });
      await est.destroy();
      res.json({ message: 'Estadística eliminada' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar estadística', error: e.message });
    }
  }
};
