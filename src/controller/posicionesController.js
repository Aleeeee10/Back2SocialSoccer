// Controlador para posiciones - siguiendo el patrón estándar del proyecto
const { posiciones } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');

const posicionesCtl = {
  // Obtener todas las posiciones usando ORM (para APIs)
  async getAllPosiciones(req, res) {
    try {
      const data = await posiciones.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener posiciones', error: e.message });
    }
  },

  // Mostrar posiciones usando consulta SQL directa (para vistas)
  async mostrarPosiciones(req, res) {
    try {
      const sql = 'SELECT * FROM posiciones ORDER BY puntos DESC, id ASC';
      const posicionesData = await pool.query(sql);
      res.json(posicionesData);
    } catch (error) {
      console.error('Error al mostrar posiciones:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear posición usando ORM
  async createPosicion(req, res) {
    try {
      const newPosicion = await posiciones.create(req.body);
      res.status(201).json(newPosicion);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear posición', error: e.message });
    }
  },

  // Mandar/enviar posición (método híbrido para casos especiales)
  async mandarPosicion(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const posicion = await posiciones.findByPk(id);
      if (!posicion) {
        return res.status(404).json({ message: 'Posición no encontrada' });
      }

      // Encriptar datos sensibles si es necesario
      const posicionData = {
        ...posicion.toJSON(),
        fechaConsulta: encrypDates(new Date())
      };

      res.json(posicionData);
    } catch (error) {
      console.error('Error al mandar posición:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar posición por ID
  async getById(req, res) {
    try {
      const posicion = await posiciones.findByPk(req.params.id);
      if (!posicion) return res.status(404).json({ message: 'Posición no encontrada' });
      res.json(posicion);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar posición', error: e.message });
    }
  },

  // Actualizar posición
  async update(req, res) {
    try {
      const id = req.params.id;
      const posicion = await posiciones.findByPk(id);
      if (!posicion) return res.status(404).json({ message: 'Posición no encontrada' });
      await posicion.update(req.body);
      res.json(posicion);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar posición', error: e.message });
    }
  },

  // Eliminar posición
  async delete(req, res) {
    try {
      const id = req.params.id;
      const posicion = await posiciones.findByPk(id);
      if (!posicion) return res.status(404).json({ message: 'Posición no encontrada' });
      await posicion.destroy();
      res.json({ message: 'Posición eliminada' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar posición', error: e.message });
    }
  }
};

module.exports = posicionesCtl;
