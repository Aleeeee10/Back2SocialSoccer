const Favoritos = require('../model/nonRelational/favoritos');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await Favoritos.find();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener favoritos', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const favorito = await Favoritos.findById(req.params.id);
      if (!favorito) return res.status(404).json({ message: 'Favorito no encontrado' });
      res.json(favorito);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar favorito', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const nuevo = await Favoritos.create(req.body);
      res.status(201).json(nuevo);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear favorito', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const actualizado = await Favoritos.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!actualizado) return res.status(404).json({ message: 'Favorito no encontrado' });
      res.json(actualizado);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar favorito', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const eliminado = await Favoritos.findByIdAndDelete(req.params.id);
      if (!eliminado) return res.status(404).json({ message: 'Favorito no encontrado' });
      res.json({ message: 'Favorito eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar favorito', error: e.message });
    }
  }
};
