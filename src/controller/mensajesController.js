const Mensajes = require('../model/nonRelational/mensajes');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await Mensajes.find();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener mensajes', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const msg = await Mensajes.findById(req.params.id);
      if (!msg) return res.status(404).json({ message: 'Mensaje no encontrado' });
      res.json(msg);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar mensaje', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const nuevo = await Mensajes.create(req.body);
      res.status(201).json(nuevo);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear mensaje', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const actualizado = await Mensajes.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!actualizado) return res.status(404).json({ message: 'Mensaje no encontrado' });
      res.json(actualizado);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar mensaje', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const eliminado = await Mensajes.findByIdAndDelete(req.params.id);
      if (!eliminado) return res.status(404).json({ message: 'Mensaje no encontrado' });
      res.json({ message: 'Mensaje eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar mensaje', error: e.message });
    }
  }
};
