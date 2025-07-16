// Controlador para roles - siguiendo el patrón estándar del proyecto
const { roles } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');

const rolesCtl = {
  // Obtener todos los roles usando ORM (para APIs)
  async getAllRoles(req, res) {
    try {
      const data = await roles.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener roles', error: e.message });
    }
  },

  // Mostrar roles usando consulta SQL directa (para vistas)
  async mostrarRoles(req, res) {
    try {
      const sql = 'SELECT * FROM roles ORDER BY id ASC';
      const rolesData = await pool.query(sql);
      res.json(rolesData);
    } catch (error) {
      console.error('Error al mostrar roles:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear rol usando ORM
  async createRole(req, res) {
    try {
      const newRole = await roles.create(req.body);
      res.status(201).json(newRole);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear rol', error: e.message });
    }
  },

  // Mandar/enviar rol (método híbrido para casos especiales)
  async mandarRole(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const role = await roles.findByPk(id);
      if (!role) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }

      // Encriptar datos sensibles si es necesario
      const roleData = {
        ...role.toJSON(),
        fechaConsulta: encrypDates(new Date())
      };

      res.json(roleData);
    } catch (error) {
      console.error('Error al mandar rol:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar rol por ID
  async getById(req, res) {
    try {
      const role = await roles.findByPk(req.params.id);
      if (!role) return res.status(404).json({ message: 'Rol no encontrado' });
      res.json(role);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar rol', error: e.message });
    }
  },

  // Actualizar rol
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

  // Eliminar rol
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

module.exports = rolesCtl;
