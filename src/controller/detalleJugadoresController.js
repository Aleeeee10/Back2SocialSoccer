// Controlador para detalleJugadores - siguiendo el patrón estándar del proyecto
const { detalleJugadores } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');

const detalleJugadoresCtl = {
  // Obtener todos los detalle jugadores usando ORM (para APIs)
  async getAllDetalleJugadores(req, res) {
    try {
      const detalles = await detalleJugadores.findAll();
      res.json(detalles);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener detalle jugadores', error: error.message });
    }
  },

  // Mostrar detalle jugadores usando consulta SQL directa (para vistas)
  async mostrarDetalleJugadores(req, res) {
    try {
      const sql = 'SELECT * FROM detalleJugadores ORDER BY nacionalidad ASC';
      const detallesData = await pool.query(sql);
      res.json(detallesData);
    } catch (error) {
      console.error('Error al mostrar detalle jugadores:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear detalle jugador usando ORM
  async createDetalleJugador(req, res) {
    try {
      const nuevoDetalle = await detalleJugadores.create(req.body);
      res.status(201).json(nuevoDetalle);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear detalle jugador', error: error.message });
    }
  },

  // Mandar/enviar detalle jugador (método híbrido para casos especiales)
  async mandarDetalleJugador(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const detalle = await detalleJugadores.findByPk(id);
      if (!detalle) {
        return res.status(404).json({ message: 'Detalle jugador no encontrado' });
      }

      // Encriptar datos sensibles si es necesario
      const detalleData = {
        ...detalle.toJSON(),
        fechaConsulta: encrypDates(new Date())
      };

      res.json(detalleData);
    } catch (error) {
      console.error('Error al mandar detalle jugador:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar detalle jugador por ID
  async getById(req, res) {
    try {
      const detalle = await detalleJugadores.findByPk(req.params.id);
      if (!detalle) {
        return res.status(404).json({ message: 'Detalle jugador no encontrado' });
      }
      res.json(detalle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar detalle jugador
  async update(req, res) {
    try {
      const detalle = await detalleJugadores.findByPk(req.params.id);
      if (!detalle) {
        return res.status(404).json({ message: 'Detalle jugador no encontrado' });
      }
      await detalle.update(req.body);
      res.json(detalle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar detalle jugador
  async delete(req, res) {
    try {
      const detalle = await detalleJugadores.findByPk(req.params.id);
      if (!detalle) {
        return res.status(404).json({ message: 'Detalle jugador no encontrado' });
      }
      await detalle.destroy();
      res.json({ message: 'Detalle jugador eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = detalleJugadoresCtl;
