// controller/playersController.js
const { players } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await players.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener jugadores', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const player = await players.findByPk(req.params.id);
      if (!player) return res.status(404).json({ message: 'Jugador no encontrado' });
      res.json(player);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar jugador', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newPlayer = await players.create(req.body);
      res.status(201).json(newPlayer);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear jugador', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const player = await players.findByPk(id);
      if (!player) return res.status(404).json({ message: 'Jugador no encontrado' });
      await player.update(req.body);
      res.json(player);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar jugador', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const player = await players.findByPk(id);
      if (!player) return res.status(404).json({ message: 'Jugador no encontrado' });
      await player.destroy();
      res.json({ message: 'Jugador eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar jugador', error: e.message });
    }
  }
};
