// Controlador para matches - siguiendo el patrón estándar del proyecto
const { matches } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');

const matchesCtl = {
  // Obtener todos los partidos usando ORM (para APIs)
  async getAllMatches(req, res) {
    try {
      const data = await matches.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener partidos', error: e.message });
    }
  },

  // Mostrar partidos usando consulta SQL directa (para vistas)
  async mostrarMatches(req, res) {
    try {
      const sql = 'SELECT * FROM matches ORDER BY fecha DESC, hora DESC';
      const matchesData = await pool.query(sql);
      res.json(matchesData);
    } catch (error) {
      console.error('Error al mostrar partidos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear partido usando ORM
  async createMatch(req, res) {
    try {
      const newMatch = await matches.create(req.body);
      res.status(201).json(newMatch);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear partido', error: e.message });
    }
  },

  // Mandar/enviar partido (método híbrido para casos especiales)
  async mandarMatch(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const match = await matches.findByPk(id);
      if (!match) {
        return res.status(404).json({ message: 'Partido no encontrado' });
      }

      // Encriptar datos sensibles si es necesario
      const matchData = {
        ...match.toJSON(),
        fechaConsulta: encrypDates(new Date())
      };

      res.json(matchData);
    } catch (error) {
      console.error('Error al mandar partido:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar partido por ID
  async getById(req, res) {
    try {
      const match = await matches.findByPk(req.params.id);
      if (!match) return res.status(404).json({ message: 'Partido no encontrado' });
      res.json(match);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar partido', error: e.message });
    }
  },

  // Actualizar partido
  async update(req, res) {
    try {
      const id = req.params.id;
      const match = await matches.findByPk(id);
      if (!match) return res.status(404).json({ message: 'Partido no encontrado' });
      await match.update(req.body);
      res.json(match);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar partido', error: e.message });
    }
  },

  // Eliminar partido
  async delete(req, res) {
    try {
      const id = req.params.id;
      const match = await matches.findByPk(id);
      if (!match) return res.status(404).json({ message: 'Partido no encontrado' });
      await match.destroy();
      res.json({ message: 'Partido eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar partido', error: e.message });
    }
  }
};

module.exports = matchesCtl;
