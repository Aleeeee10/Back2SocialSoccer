const NotificationsLog = require('../model/nonRelational/NotificationsLog');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await NotificationsLog.find();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener notificaciones', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const noti = await NotificationsLog.findById(req.params.id);
      if (!noti) return res.status(404).json({ message: 'Notificación no encontrada' });
      res.json(noti);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar notificación', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const nueva = await NotificationsLog.create(req.body);
      res.status(201).json(nueva);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear notificación', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const actualizada = await NotificationsLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!actualizada) return res.status(404).json({ message: 'Notificación no encontrada' });
      res.json(actualizada);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar notificación', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const eliminada = await NotificationsLog.findByIdAndDelete(req.params.id);
      if (!eliminada) return res.status(404).json({ message: 'Notificación no encontrada' });
      res.json({ message: 'Notificación eliminada' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar notificación', error: e.message });
    }
  }
};
