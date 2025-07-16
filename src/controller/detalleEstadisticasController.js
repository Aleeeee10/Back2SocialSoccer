// Controlador para detalleEstadisticas - siguiendo el patrón estándar del proyecto
const { detalleEstadisticas } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');

const detalleEstadisticasCtl = {
  // Obtener todos los detalle estadísticas usando ORM (para APIs)
  async getAllDetalleEstadisticas(req, res) {
    try {
      const data = await detalleEstadisticas.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener detalle estadísticas', error: e.message });
    }
  },

  // Mostrar detalle estadísticas usando consulta SQL directa (para vistas)
  async mostrarDetalleEstadisticas(req, res) {
    try {
      const sql = 'SELECT * FROM detalleEstadisticas ORDER BY goles DESC, asistencias DESC';
      const detallesData = await pool.query(sql);
      res.json(detallesData);
    } catch (error) {
      console.error('Error al mostrar detalle estadísticas:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear detalle estadística usando ORM
  async createDetalleEstadistica(req, res) {
    try {
      const newDet = await detalleEstadisticas.create(req.body);
      res.status(201).json(newDet);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear detalle', error: e.message });
    }
  },

  // Mandar/enviar detalle estadística (método híbrido para casos especiales)
  async mandarDetalleEstadistica(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const det = await detalleEstadisticas.findByPk(id);
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
      console.error('Error al mandar detalle estadística:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar detalle estadística por ID
  async getById(req, res) {
    try {
      const det = await detalleEstadisticas.findByPk(req.params.id);
      if (!det) return res.status(404).json({ message: 'Detalle no encontrado' });
      res.json(det);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar detalle', error: e.message });
    }
  },

  // Actualizar detalle estadística
  async update(req, res) {
    try {
      const id = req.params.id;
      const det = await detalleEstadisticas.findByPk(id);
      if (!det) return res.status(404).json({ message: 'Detalle no encontrado' });
      await det.update(req.body);
      res.json(det);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar detalle', error: e.message });
    }
  },

  // Eliminar detalle estadística
  async delete(req, res) {
    try {
      const id = req.params.id;
      const det = await detalleEstadisticas.findByPk(id);
      if (!det) return res.status(404).json({ message: 'Detalle no encontrado' });
      await det.destroy();
      res.json({ message: 'Detalle eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar detalle', error: e.message });
    }
  }
};

module.exports = detalleEstadisticasCtl;
