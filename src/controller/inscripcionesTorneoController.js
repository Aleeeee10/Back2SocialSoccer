// controller/inscripcionesTorneoController.js
const { inscripcionesTorneo } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await inscripcionesTorneo.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener inscripciones', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const inscripcion = await inscripcionesTorneo.findByPk(req.params.id);
      if (!inscripcion) return res.status(404).json({ message: 'Inscripción no encontrada' });
      res.json(inscripcion);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar inscripción', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newInscripcion = await inscripcionesTorneo.create(req.body);
      res.status(201).json(newInscripcion);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear inscripción', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const inscripcion = await inscripcionesTorneo.findByPk(id);
      if (!inscripcion) return res.status(404).json({ message: 'Inscripción no encontrada' });
      await inscripcion.update(req.body);
      res.json(inscripcion);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar inscripción', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const inscripcion = await inscripcionesTorneo.findByPk(id);
      if (!inscripcion) return res.status(404).json({ message: 'Inscripción no encontrada' });
      await inscripcion.destroy();
      res.json({ message: 'Inscripción eliminada' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar inscripción', error: e.message });
    }
  }
};
