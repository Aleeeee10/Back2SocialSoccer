// Controlador para referees - siguiendo el patrón estándar del proyecto
const { referees } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');

const refereesCtl = {
  // Obtener todos los árbitros usando ORM (para APIs)
  async getAllReferees(req, res) {
    try {
      const data = await referees.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener árbitros', error: e.message });
    }
  },

  // Mostrar árbitros usando consulta SQL directa (para vistas)
  async mostrarReferees(req, res) {
    try {
      const sql = 'SELECT * FROM referees ORDER BY id ASC';
      const refereesData = await pool.query(sql);
      res.json(refereesData);
    } catch (error) {
      console.error('Error al mostrar árbitros:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear árbitro usando ORM
  async createReferee(req, res) {
    try {
      const newReferee = await referees.create(req.body);
      res.status(201).json(newReferee);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear árbitro', error: e.message });
    }
  },

  // Mandar/enviar árbitro (método híbrido para casos especiales)
  async mandarReferee(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const referee = await referees.findByPk(id);
      if (!referee) {
        return res.status(404).json({ message: 'Árbitro no encontrado' });
      }

      // Encriptar datos sensibles si es necesario
      const refereeData = {
        ...referee.toJSON(),
        fechaConsulta: encrypDates(new Date())
      };

      res.json(refereeData);
    } catch (error) {
      console.error('Error al mandar árbitro:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar árbitro por ID
  async getById(req, res) {
    try {
      const referee = await referees.findByPk(req.params.id);
      if (!referee) return res.status(404).json({ message: 'Árbitro no encontrado' });
      res.json(referee);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar árbitro', error: e.message });
    }
  },

  // Actualizar árbitro
  async update(req, res) {
    try {
      const id = req.params.id;
      const referee = await referees.findByPk(id);
      if (!referee) return res.status(404).json({ message: 'Árbitro no encontrado' });
      await referee.update(req.body);
      res.json(referee);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar árbitro', error: e.message });
    }
  },

  // Eliminar árbitro
  async delete(req, res) {
    try {
      const id = req.params.id;
      const referee = await referees.findByPk(id);
      if (!referee) return res.status(404).json({ message: 'Árbitro no encontrado' });
      await referee.destroy();
      res.json({ message: 'Árbitro eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar árbitro', error: e.message });
    }
  }
};

module.exports = refereesCtl;
