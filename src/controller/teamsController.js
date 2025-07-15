// controller/teamsController.js
const { teams } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await teams.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener equipos', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const team = await teams.findByPk(req.params.id);
      if (!team) return res.status(404).json({ message: 'Equipo no encontrado' });
      res.json(team);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar equipo', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newTeam = await teams.create(req.body);
      res.status(201).json(newTeam);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear equipo', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const team = await teams.findByPk(id);
      if (!team) return res.status(404).json({ message: 'Equipo no encontrado' });
      await team.update(req.body);
      res.json(team);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar equipo', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const team = await teams.findByPk(id);
      if (!team) return res.status(404).json({ message: 'Equipo no encontrado' });
      await team.destroy();
      res.json({ message: 'Equipo eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar equipo', error: e.message });
    }
  }
};
