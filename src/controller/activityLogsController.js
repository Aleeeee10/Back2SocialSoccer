const ActivityLogs = require('../model/nonRelational/ActivityLogs');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await ActivityLogs.find();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener logs', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const log = await ActivityLogs.findById(req.params.id);
      if (!log) return res.status(404).json({ message: 'Log no encontrado' });
      res.json(log);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar log', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newLog = await ActivityLogs.create(req.body);
      res.status(201).json(newLog);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear log', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const updated = await ActivityLogs.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Log no encontrado' });
      res.json(updated);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar log', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const deleted = await ActivityLogs.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Log no encontrado' });
      res.json({ message: 'Log eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar log', error: e.message });
    }
  }
};
