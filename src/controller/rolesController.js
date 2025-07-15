// controller/rolesController.js
const { roles } = require('../dataBase/dataBase.orm');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await roles.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener roles', error: e.message });
    }
  },
  async getById(req, res) {
    try {
      const role = await roles.findByPk(req.params.id);
      if (!role) return res.status(404).json({ message: 'Rol no encontrado' });
      res.json(role);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar rol', error: e.message });
    }
  },
  async create(req, res) {
    try {
      const newRole = await roles.create(req.body);
      res.status(201).json(newRole);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear rol', error: e.message });
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const role = await roles.findByPk(id);
      if (!role) return res.status(404).json({ message: 'Rol no encontrado' });
      await role.update(req.body);
      res.json(role);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar rol', error: e.message });
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id;
      const role = await roles.findByPk(id);
      if (!role) return res.status(404).json({ message: 'Rol no encontrado' });
      await role.destroy();
      res.json({ message: 'Rol eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar rol', error: e.message });
    }
  }
};
