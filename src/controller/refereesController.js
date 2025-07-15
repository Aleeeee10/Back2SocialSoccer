// controller/refereesController.js
const { referees } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await referees.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener árbitros', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const referee = await referees.findByPk(req.params.id);
      if (!referee) return res.status(404).json({ message: 'Árbitro no encontrado' });
      res.json(referee);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar árbitro', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newReferee = await referees.create(req.body);
      res.status(201).json(newReferee);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear árbitro', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const referee = await referees.findByPk(id);
      if (!referee) return res.status(404).json({ message: 'Árbitro no encontrado' });
      await referee.update(req.body);
      res.json(referee);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar árbitro', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const referee = await referees.findByPk(id);
      if (!referee) return res.status(404).json({ message: 'Árbitro no encontrado' });
      await referee.destroy();
      res.json({ message: 'Árbitro eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar árbitro', error: e.message });
    }
  }
};
