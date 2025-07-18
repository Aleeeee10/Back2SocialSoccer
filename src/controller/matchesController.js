// Controlador para matches - siguiendo el patrón estándar del proyecto
const { matches } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const mongo = require('../dataBase/dataBase.mongo');
const MatchEvents = require('../model/nonRelational/MatchEvents'); // Modelo no relacional para eventos de partidos
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

  // Mostrar partidos con sus eventos (híbrido: SQL + MongoDB)
  async mostrarMatches(req, res) {
    try {
      const sql = 'SELECT * FROM matches ORDER BY fecha DESC, hora DESC';
      const matchesData = await pool.query(sql);
      
      // Si hay partidos, obtener eventos del primer partido como ejemplo
      if (matchesData.length > 0) {
        const matchEvents = await MatchEvents.findOne({ matchId: matchesData[0].id });
        const data = {
          partidos: matchesData,
          eventos: matchEvents
        };
        res.json(data);
      } else {
        res.json({ partidos: matchesData, eventos: null });
      }
    } catch (error) {
      console.error('Error al mostrar partidos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear partido usando ORM + eventos iniciales en MongoDB
  async createMatch(req, res) {
    try {
      const { clima, asistencia, arbitroComentarios, ...matchData } = req.body;
      
      // 1. Crear partido en MySQL
      const newMatch = await matches.create(matchData);
      
      // 2. Crear eventos iniciales en MongoDB
      const defaultMatchEvents = {
        matchId: newMatch.id,
        eventos: [], // Sin eventos iniciales
        comentarios: [{
          minuto: 0,
          comentario: `Partido creado: ${newMatch.descripcion || 'Nuevo partido'}`,
          timestamp: new Date()
        }],
        clima: clima || {
          temperatura: "22°C",
          condicion: "soleado"
        },
        asistencia: asistencia || 0,
        arbitroComentarios: arbitroComentarios || "Partido creado correctamente",
        estado: true
      };
      
      const matchEvents = await MatchEvents.create(defaultMatchEvents);
      
      // 3. Respuesta con ambos datos
      res.status(201).json({
        partido: newMatch,
        eventos: matchEvents,
        mensaje: 'Partido y eventos creados exitosamente'
      });
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
      
      // Eliminar eventos relacionados (eliminación lógica)
      await MatchEvents.updateMany(
        { matchId: id },
        { estado: false }
      );
      
      await match.destroy();
      res.json({ message: 'Partido y eventos eliminados' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar partido', error: e.message });
    }
  },

  // FUNCIONES ESPECÍFICAS PARA MATCH EVENTS (MongoDB)
  
  // Obtener eventos de un partido específico
  async getMatchEvents(req, res) {
    try {
      const { matchId } = req.params;
      const events = await MatchEvents.findOne({ matchId: parseInt(matchId), estado: true });
      res.json(events);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener eventos', error: e.message });
    }
  },

  // Obtener partido completo con todos sus eventos
  async getMatchWithEvents(req, res) {
    try {
      const { matchId } = req.params;
      
      // Obtener partido de MySQL
      const match = await matches.findByPk(matchId);
      if (!match) return res.status(404).json({ message: 'Partido no encontrado' });
      
      // Obtener eventos de MongoDB
      const events = await MatchEvents.findOne({ matchId: parseInt(matchId), estado: true });
      
      res.json({
        partido: match,
        eventos: events,
        totalEventos: events ? events.eventos.length : 0
      });
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener datos completos', error: e.message });
    }
  },

  // Agregar evento al partido (gol, tarjeta, etc.)
  async addEvent(req, res) {
    try {
      const { matchId } = req.params;
      const { minuto, tipo, jugadorId, descripcion } = req.body;
      
      const matchEvents = await MatchEvents.findOne({ 
        matchId: parseInt(matchId), 
        estado: true 
      });
      
      if (!matchEvents) return res.status(404).json({ message: 'Eventos del partido no encontrados' });
      
      matchEvents.eventos.push({
        minuto,
        tipo,
        jugadorId,
        descripcion,
        timestamp: new Date()
      });
      
      await matchEvents.save();
      res.json({ message: 'Evento agregado', eventos: matchEvents });
    } catch (e) {
      res.status(400).json({ message: 'Error al agregar evento', error: e.message });
    }
  },

  // Agregar comentario al partido
  async addComment(req, res) {
    try {
      const { matchId } = req.params;
      const { minuto, comentario } = req.body;
      
      const matchEvents = await MatchEvents.findOne({ 
        matchId: parseInt(matchId), 
        estado: true 
      });
      
      if (!matchEvents) return res.status(404).json({ message: 'Eventos del partido no encontrados' });
      
      matchEvents.comentarios.push({
        minuto,
        comentario,
        timestamp: new Date()
      });
      
      await matchEvents.save();
      res.json({ message: 'Comentario agregado', eventos: matchEvents });
    } catch (e) {
      res.status(400).json({ message: 'Error al agregar comentario', error: e.message });
    }
  },

  // Actualizar información del clima y asistencia
  async updateMatchInfo(req, res) {
    try {
      const { matchId } = req.params;
      const { clima, asistencia, arbitroComentarios } = req.body;
      
      const updateData = {};
      if (clima) updateData.clima = clima;
      if (asistencia !== undefined) updateData.asistencia = asistencia;
      if (arbitroComentarios) updateData.arbitroComentarios = arbitroComentarios;
      
      const updatedEvents = await MatchEvents.findOneAndUpdate(
        { matchId: parseInt(matchId), estado: true },
        updateData,
        { new: true }
      );
      
      if (!updatedEvents) return res.status(404).json({ message: 'Eventos del partido no encontrados' });
      res.json(updatedEvents);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar información del partido', error: e.message });
    }
  },

  // Obtener resumen del partido (eventos más importantes)
  async getMatchSummary(req, res) {
    try {
      const { matchId } = req.params;
      
      const events = await MatchEvents.findOne({ matchId: parseInt(matchId), estado: true });
      if (!events) return res.status(404).json({ message: 'Eventos no encontrados' });
      
      // Filtrar eventos importantes (goles, tarjetas)
      const importantEvents = events.eventos.filter(evento => 
        ['gol', 'tarjeta_amarilla', 'tarjeta_roja', 'cambio'].includes(evento.tipo)
      );
      
      res.json({
        matchId: parseInt(matchId),
        totalEventos: events.eventos.length,
        eventosImportantes: importantEvents,
        clima: events.clima,
        asistencia: events.asistencia,
        ultimoComentario: events.comentarios[events.comentarios.length - 1]
      });
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener resumen', error: e.message });
    }
  }
};

module.exports = matchesCtl;
