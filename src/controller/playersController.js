// Controlador para players - siguiendo el patrón estándar del proyecto
const { players } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');

const playersCtl = {
  // Obtener todos los jugadores usando ORM (para APIs)
  async getAllPlayers(req, res) {
    try {
      const data = await players.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener jugadores', error: e.message });
    }
  },

  // Mostrar jugadores usando consulta SQL directa (para vistas)
  async mostrarPlayers(req, res) {
    try {
      const sql = 'SELECT * FROM players ORDER BY nombre ASC';
      const playersData = await pool.query(sql);
      res.json(playersData);
    } catch (error) {
      console.error('Error al mostrar jugadores:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear jugador usando ORM
  async createPlayer(req, res) {
    try {
      const newPlayer = await players.create(req.body);
      res.status(201).json(newPlayer);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear jugador', error: e.message });
    }
  },

  // Mandar/enviar jugador (método híbrido para casos especiales)
  async mandarPlayer(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const player = await players.findByPk(id);
      if (!player) {
        return res.status(404).json({ message: 'Jugador no encontrado' });
      }

      // Encriptar datos sensibles si es necesario
      const playerData = {
        ...player.toJSON(),
        fechaConsulta: encrypDates(new Date())
      };

      res.json(playerData);
    } catch (error) {
      console.error('Error al mandar jugador:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar jugador por ID
  async getById(req, res) {
    try {
      const player = await players.findByPk(req.params.id);
      if (!player) return res.status(404).json({ message: 'Jugador no encontrado' });
      res.json(player);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar jugador', error: e.message });
    }
  },

  // Actualizar jugador
  async update(req, res) {
    try {
      const id = req.params.id;
      const player = await players.findByPk(id);
      if (!player) return res.status(404).json({ message: 'Jugador no encontrado' });
      await player.update(req.body);
      res.json(player);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar jugador', error: e.message });
    }
  },

  // Eliminar jugador
  async delete(req, res) {
    try {
      const id = req.params.id;
      const player = await players.findByPk(id);
      if (!player) return res.status(404).json({ message: 'Jugador no encontrado' });
      await player.destroy();
      res.json({ message: 'Jugador eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar jugador', error: e.message });
    }
  }
};

module.exports = playersCtl;
