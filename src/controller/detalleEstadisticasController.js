// controller/detalleEstadisticasController.js
const { detalleEstadisticas } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await detalleEstadisticas.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener detalle estadísticas', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const det = await detalleEstadisticas.findByPk(req.params.id);
      if (!det) return res.status(404).json({ message: 'Detalle no encontrado' });
      res.json(det);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar detalle', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newDet = await detalleEstadisticas.create(req.body);
      res.status(201).json(newDet);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear detalle', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const det = await detalleEstadisticas.findByPk(id);
      if (!det) return res.status(404).json({ message: 'Detalle no encontrado' });
      await det.update(req.body);
      res.json(det);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar detalle', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const det = await detalleEstadisticas.findByPk(id);
      if (!det) return res.status(404).json({ message: 'Detalle no encontrado' });
      await det.destroy();
      res.json({ message: 'Detalle eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar detalle', error: e.message });
    }
  }
};
