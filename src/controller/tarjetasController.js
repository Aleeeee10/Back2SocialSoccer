// controller/tarjetasController.js
const { tarjetas } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await tarjetas.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener tarjetas', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const tarjeta = await tarjetas.findByPk(req.params.id);
      if (!tarjeta) return res.status(404).json({ message: 'Tarjeta no encontrada' });
      res.json(tarjeta);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar tarjeta', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newTarjeta = await tarjetas.create(req.body);
      res.status(201).json(newTarjeta);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear tarjeta', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const tarjeta = await tarjetas.findByPk(id);
      if (!tarjeta) return res.status(404).json({ message: 'Tarjeta no encontrada' });
      await tarjeta.update(req.body);
      res.json(tarjeta);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar tarjeta', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const tarjeta = await tarjetas.findByPk(id);
      if (!tarjeta) return res.status(404).json({ message: 'Tarjeta no encontrada' });
      await tarjeta.destroy();
      res.json({ message: 'Tarjeta eliminada' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar tarjeta', error: e.message });
    }
  }
};
