// Controlador para detalleResultados - siguiendo el patrón estándar del proyecto
const { detalleResultados } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');

const detalleResultadosCtl = {
  // Obtener todos los detalle resultados usando ORM (para APIs)
  async getAllDetalleResultados(req, res) {
    try {
      const detalles = await detalleResultados.findAll();
      res.json(detalles);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener detalle resultados', error: error.message });
    }
  },

  // Mostrar detalle resultados usando consulta SQL directa (para vistas)
  async mostrarDetalleResultados(req, res) {
    try {
      const sql = 'SELECT * FROM detalleResultados ORDER BY goles DESC, asistencias DESC';
      const detallesData = await pool.query(sql);
      res.json(detallesData);
    } catch (error) {
      console.error('Error al mostrar detalle resultados:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear detalle resultado usando ORM
  async createDetalleResultado(req, res) {
    try {
      const newDetalle = await detalleResultados.create(req.body);
      res.status(201).json(newDetalle);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear detalle resultado', error: error.message });
    }
  },

  // Mandar/enviar detalle resultado (método híbrido para casos especiales)
  async mandarDetalleResultado(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const detalle = await detalleResultados.findByPk(id);
      if (!detalle) {
        return res.status(404).json({ message: 'Detalle resultado no encontrado' });
      }

      // Encriptar datos sensibles si es necesario
      const detalleData = {
        ...detalle.toJSON(),
        fechaConsulta: encrypDates(new Date())
      };

      res.json(detalleData);
    } catch (error) {
      console.error('Error al mandar detalle resultado:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar detalle resultado por ID
  async getById(req, res) {
    try {
      const detalle = await detalleResultados.findByPk(req.params.id);
      if (!detalle) return res.status(404).json({ message: 'No encontrado' });
      res.json(detalle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar detalle resultado
  async update(req, res) {
    try {
      const detalle = await detalleResultados.findByPk(req.params.id);
      if (!detalle) return res.status(404).json({ message: 'No encontrado' });

      await detalle.update(req.body);
      res.json(detalle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar detalle resultado
  async delete(req, res) {
    try {
      const detalle = await detalleResultados.findByPk(req.params.id);
      if (!detalle) return res.status(404).json({ message: 'No encontrado' });

      await detalle.destroy();
      res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = detalleResultadosCtl;
