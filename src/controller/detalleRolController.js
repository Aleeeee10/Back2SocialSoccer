// Controlador para detalleRol - siguiendo el patrón estándar del proyecto
const { detalleRol } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');

const detalleRolCtl = {
  // Obtener todos los detalle roles usando ORM (para APIs)
  async getAllDetalleRoles(req, res) {
    try {
      const data = await detalleRol.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener detalle roles', error: e.message });
    }
  },

  // Mostrar detalle roles usando consulta SQL directa (para vistas)
  async mostrarDetalleRoles(req, res) {
    try {
      const sql = 'SELECT * FROM detalleRols ORDER BY id DESC';
      const detalleRolesData = await pool.query(sql);
      res.json(detalleRolesData);
    } catch (error) {
      console.error('Error al mostrar detalle roles:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear detalle rol usando ORM
  async createDetalleRol(req, res) {
    try {
      const newDet = await detalleRol.create(req.body);
      res.status(201).json(newDet);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear detalle', error: e.message });
    }
  },

  // Mandar/enviar detalle rol (método híbrido para casos especiales)
  async mandarDetalleRol(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const det = await detalleRol.findByPk(id);
      if (!det) {
        return res.status(404).json({ message: 'Detalle no encontrado' });
      }

      // Encriptar datos sensibles si es necesario
      const detalleData = {
        ...det.toJSON(),
        fechaConsulta: encrypDates(new Date())
      };

      res.json(detalleData);
    } catch (error) {
      console.error('Error al mandar detalle rol:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar detalle rol por ID
  async getById(req, res) {
    try {
      const det = await detalleRol.findByPk(req.params.id);
      if (!det) return res.status(404).json({ message: 'Detalle no encontrado' });
      res.json(det);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar detalle', error: e.message });
    }
  },

  // Actualizar detalle rol
  async update(req, res) {
    try {
      const id = req.params.id;
      const det = await detalleRol.findByPk(id);
      if (!det) return res.status(404).json({ message: 'Detalle no encontrado' });
      await det.update(req.body);
      res.json(det);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar detalle', error: e.message });
    }
  },

  // Eliminar detalle rol
  async delete(req, res) {
    try {
      const id = req.params.id;
      const det = await detalleRol.findByPk(id);
      if (!det) return res.status(404).json({ message: 'Detalle no encontrado' });
      await det.destroy();
      res.json({ message: 'Detalle eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar detalle', error: e.message });
    }
  }
};

module.exports = detalleRolCtl;
