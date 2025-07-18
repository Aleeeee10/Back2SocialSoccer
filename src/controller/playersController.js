// Controlador para players - siguiendo el patrón estándar del proyecto
const { players } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const mongo = require('../dataBase/dataBase.mongo');
const PlayerStats = require('../model/nonRelational/PlayerStats'); // Modelo no relacional para estadísticas de jugadores
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

  // Mostrar jugadores con sus estadísticas (híbrido: SQL + MongoDB)
  async mostrarPlayers(req, res) {
    try {
      const sql = 'SELECT * FROM players ORDER BY nombre ASC';
      const playersData = await pool.query(sql);
      
      // Si hay jugadores, obtener estadísticas del primer jugador como ejemplo
      if (playersData.length > 0) {
        const playerStats = await PlayerStats.findOne({ playerId: playersData[0].id });
        const data = {
          jugadores: playersData,
          estadisticas: playerStats
        };
        res.json(data);
      } else {
        res.json({ jugadores: playersData, estadisticas: null });
      }
    } catch (error) {
      console.error('Error al mostrar jugadores:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear jugador usando ORM + estadísticas iniciales en MongoDB
  async createPlayer(req, res) {
    try {
      const { temporada = "2024-2025", ...playerData } = req.body;
      
      // 1. Crear jugador en MySQL
      const newPlayer = await players.create(playerData);
      
      // 2. Crear estadísticas iniciales en MongoDB
      const defaultPlayerStats = {
        playerId: newPlayer.id,
        temporada: temporada,
        goles: 0,
        asistencias: 0,
        tarjetasAmarillas: 0,
        tarjetasRojas: 0,
        minutosJugados: 0,
        partidosJugados: 0,
        rating: 0,
        lesiones: [],
        observaciones: `Estadísticas iniciales para ${newPlayer.nombre}`,
        estado: true
      };
      
      const playerStats = await PlayerStats.create(defaultPlayerStats);
      
      // 3. Respuesta con ambos datos
      res.status(201).json({
        jugador: newPlayer,
        estadisticas: playerStats,
        mensaje: 'Jugador y estadísticas creadas exitosamente'
      });
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
      
      // Eliminar estadísticas relacionadas (eliminación lógica)
      await PlayerStats.updateMany(
        { playerId: id },
        { estado: false }
      );
      
      await player.destroy();
      res.json({ message: 'Jugador y estadísticas eliminados' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar jugador', error: e.message });
    }
  },

  // FUNCIONES ESPECÍFICAS PARA PLAYER STATS (MongoDB)
  
  // Obtener estadísticas de un jugador específico
  async getPlayerStats(req, res) {
    try {
      const { playerId } = req.params;
      const stats = await PlayerStats.find({ playerId: parseInt(playerId), estado: true });
      res.json(stats);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener estadísticas', error: e.message });
    }
  },

  // Crear estadísticas manualmente
  async createPlayerStats(req, res) {
    try {
      const newStats = await PlayerStats.create(req.body);
      res.status(201).json(newStats);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear estadísticas', error: e.message });
    }
  },

  // Actualizar estadísticas de un jugador
  async updatePlayerStats(req, res) {
    try {
      const { statsId } = req.params;
      const updatedStats = await PlayerStats.findByIdAndUpdate(
        statsId,
        req.body,
        { new: true }
      );
      if (!updatedStats) return res.status(404).json({ message: 'Estadísticas no encontradas' });
      res.json(updatedStats);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar estadísticas', error: e.message });
    }
  },

  // Obtener jugador con todas sus estadísticas
  async getPlayerWithStats(req, res) {
    try {
      const { playerId } = req.params;
      
      // Obtener jugador de MySQL
      const player = await players.findByPk(playerId);
      if (!player) return res.status(404).json({ message: 'Jugador no encontrado' });
      
      // Obtener estadísticas de MongoDB
      const stats = await PlayerStats.find({ playerId: parseInt(playerId), estado: true });
      
      res.json({
        jugador: player,
        estadisticas: stats,
        totalTemporadas: stats.length
      });
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener datos completos', error: e.message });
    }
  },

  // Agregar lesión a un jugador
  async addInjury(req, res) {
    try {
      const { playerId, temporada } = req.params;
      const { tipo, fecha, tiempoRecuperacion } = req.body;
      
      const stats = await PlayerStats.findOne({ 
        playerId: parseInt(playerId), 
        temporada: temporada,
        estado: true 
      });
      
      if (!stats) return res.status(404).json({ message: 'Estadísticas no encontradas' });
      
      stats.lesiones.push({
        tipo,
        fecha: fecha || new Date(),
        tiempoRecuperacion
      });
      
      await stats.save();
      res.json({ message: 'Lesión agregada', estadisticas: stats });
    } catch (e) {
      res.status(400).json({ message: 'Error al agregar lesión', error: e.message });
    }
  }
};

module.exports = playersCtl;
