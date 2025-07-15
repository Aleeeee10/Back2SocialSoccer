// controller/resultadosController.js
const { resultados } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await resultados.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener resultados', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const resul = await resultados.findByPk(req.params.id);
      if (!resul) return res.status(404).json({ message: 'Resultado no encontrado' });
      res.json(resul);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar resultado', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newRes = await resultados.create(req.body);
      res.status(201).json(newRes);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear resultado', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const resul = await resultados.findByPk(id);
      if (!resul) return res.status(404).json({ message: 'Resultado no encontrado' });
      await resul.update(req.body);
      res.json(resul);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar resultado', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const resul = await resultados.findByPk(id);
      if (!resul) return res.status(404).json({ message: 'Resultado no encontrado' });
      await resul.destroy();
      res.json({ message: 'Resultado eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar resultado', error: e.message });
    }
  }
};
