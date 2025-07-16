// Controlador para inscripcionesTorneo - siguiendo el patrón estándar del proyecto
const { inscripcionesTorneo } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');

const inscripcionesTorneoCtl = {
  // Obtener todas las inscripciones usando ORM (para APIs)
  async getAllInscripciones(req, res) {
    try {
      const data = await inscripcionesTorneo.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener inscripciones', error: e.message });
    }
  },

  // Mostrar inscripciones usando consulta SQL directa (para vistas)
  async mostrarInscripciones(req, res) {
    try {
      const sql = 'SELECT * FROM inscripcionesTorneos ORDER BY id DESC';
      const inscripcionesData = await pool.query(sql);
      res.json(inscripcionesData);
    } catch (error) {
      console.error('Error al mostrar inscripciones:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear inscripción usando ORM
  async createInscripcion(req, res) {
    try {
      const newInscripcion = await inscripcionesTorneo.create(req.body);
      res.status(201).json(newInscripcion);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear inscripción', error: e.message });
    }
  },

  // Mandar/enviar inscripción (método híbrido para casos especiales)
  async mandarInscripcion(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const inscripcion = await inscripcionesTorneo.findByPk(id);
      if (!inscripcion) {
        return res.status(404).json({ message: 'Inscripción no encontrada' });
      }

      // Encriptar datos sensibles si es necesario
      const inscripcionData = {
        ...inscripcion.toJSON(),
        fechaConsulta: encrypDates(new Date())
      };

      res.json(inscripcionData);
    } catch (error) {
      console.error('Error al mandar inscripción:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar inscripción por ID
  async getById(req, res) {
    try {
      const inscripcion = await inscripcionesTorneo.findByPk(req.params.id);
      if (!inscripcion) return res.status(404).json({ message: 'Inscripción no encontrada' });
      res.json(inscripcion);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar inscripción', error: e.message });
    }
  },

  // Actualizar inscripción
  async update(req, res) {
    try {
      const id = req.params.id;
      const inscripcion = await inscripcionesTorneo.findByPk(id);
      if (!inscripcion) return res.status(404).json({ message: 'Inscripción no encontrada' });
      await inscripcion.update(req.body);
      res.json(inscripcion);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar inscripción', error: e.message });
    }
  },

  // Eliminar inscripción
  async delete(req, res) {
    try {
      const id = req.params.id;
      const inscripcion = await inscripcionesTorneo.findByPk(id);
      if (!inscripcion) return res.status(404).json({ message: 'Inscripción no encontrada' });
      await inscripcion.destroy();
      res.json({ message: 'Inscripción eliminada' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar inscripción', error: e.message });
    }
  }
};

module.exports = inscripcionesTorneoCtl;
