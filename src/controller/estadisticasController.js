// Controlador para estadisticas - siguiendo el patrón estándar del proyecto
const { estadisticas } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');

const estadisticasCtl = {
  // Obtener todas las estadísticas usando ORM (para APIs)
  async getAllEstadisticas(req, res) {
    try {
      const data = await estadisticas.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener estadísticas', error: e.message });
    }
  },

  // Mostrar estadísticas usando consulta SQL directa (para vistas)
  async mostrarEstadisticas(req, res) {
    try {
      const sql = 'SELECT * FROM estadisticas ORDER BY nombre ASC';
      const estadisticasData = await pool.query(sql);
      res.json(estadisticasData);
    } catch (error) {
      console.error('Error al mostrar estadísticas:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear estadística usando ORM
  async createEstadistica(req, res) {
    try {
      const newEst = await estadisticas.create(req.body);
      res.status(201).json(newEst);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear estadística', error: e.message });
    }
  },

  // Mandar/enviar estadística (método híbrido para casos especiales)
  async mandarEstadistica(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const est = await estadisticas.findByPk(id);
      if (!est) {
        return res.status(404).json({ message: 'Estadística no encontrada' });
      }

      // Encriptar datos sensibles si es necesario
      const estadisticaData = {
        ...est.toJSON(),
        fechaConsulta: encrypDates(new Date())
      };

      res.json(estadisticaData);
    } catch (error) {
      console.error('Error al mandar estadística:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar estadística por ID
  async getById(req, res) {
    try {
      const est = await estadisticas.findByPk(req.params.id);
      if (!est) return res.status(404).json({ message: 'Estadística no encontrada' });
      res.json(est);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar estadística', error: e.message });
    }
  },

  // Actualizar estadística
  async update(req, res) {
    try {
      const id = req.params.id;
      const est = await estadisticas.findByPk(id);
      if (!est) return res.status(404).json({ message: 'Estadística no encontrada' });
      await est.update(req.body);
      res.json(est);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar estadística', error: e.message });
    }
  },

  // Eliminar estadística
  async delete(req, res) {
    try {
      const id = req.params.id;
      const est = await estadisticas.findByPk(id);
      if (!est) return res.status(404).json({ message: 'Estadística no encontrada' });
      await est.destroy();
      res.json({ message: 'Estadística eliminada' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar estadística', error: e.message });
    }
  }
};

module.exports = estadisticasCtl;
