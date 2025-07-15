// controller/agendaEntrenamientosController.js
const { agendaEntrenamientos } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await agendaEntrenamientos.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener agenda de entrenamientos', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const agenda = await agendaEntrenamientos.findByPk(req.params.id);
      if (!agenda) return res.status(404).json({ message: 'Agenda no encontrada' });
      res.json(agenda);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar agenda', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newAgenda = await agendaEntrenamientos.create(req.body);
      res.status(201).json(newAgenda);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear agenda', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const agenda = await agendaEntrenamientos.findByPk(id);
      if (!agenda) return res.status(404).json({ message: 'Agenda no encontrada' });
      await agenda.update(req.body);
      res.json(agenda);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar agenda', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const agenda = await agendaEntrenamientos.findByPk(id);
      if (!agenda) return res.status(404).json({ message: 'Agenda no encontrada' });
      await agenda.destroy();
      res.json({ message: 'Agenda eliminada' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar agenda', error: e.message });
    }
  }
};
