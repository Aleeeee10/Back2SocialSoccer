const { agendaEntrenamientos } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encryptDates } = require('../lib/helpers');

const agendaEntrenamientosCtl = {
  // Obtener todas las agendas usando ORM
  getAllAgendaEntrenamientos: async (req, res) => {
    try {
      const data = await agendaEntrenamientos.findAll({
        where: { estado: true }
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mostrar agendas usando SQL directo con información completa
  mostrarAgendaEntrenamientos: async (req, res) => {
    try {
      const query = `
        SELECT ae.*, 
               t.nombre as equipo_nombre,
               d.nombre as division_nombre,
               CONCAT(ae.fecha, ' ', ae.hora) as fecha_hora_completa,
               CASE 
                 WHEN ae.fecha < CURDATE() THEN 'Pasado'
                 WHEN ae.fecha = CURDATE() THEN 'Hoy'
                 ELSE 'Futuro'
               END as estado_temporal
        FROM agendaEntrenamientos ae
        LEFT JOIN teams t ON ae.teamId = t.id
        LEFT JOIN divisions d ON t.divisionId = d.id
        WHERE ae.estado = true
        ORDER BY ae.fecha ASC, ae.hora ASC
      `;
      const data = await pool.query(query);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear nueva agenda usando ORM
  createAgendaEntrenamientos: async (req, res) => {
    try {
      const newAgenda = await agendaEntrenamientos.create({
        ...req.body,
        estado: true
      });
      res.status(201).json(newAgenda);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Mandar agenda específica con encriptación
  mandarAgendaEntrenamientos: async (req, res) => {
    try {
      const agenda = await agendaEntrenamientos.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      
      if (!agenda) {
        return res.status(404).json({ message: 'Agenda de entrenamiento no encontrada' });
      }

      const encryptedAgenda = encryptDates(agenda.toJSON());
      res.json(encryptedAgenda);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener agenda por ID
  getById: async (req, res) => {
    try {
      const agenda = await agendaEntrenamientos.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      if (!agenda) return res.status(404).json({ message: 'Agenda no encontrada' });
      res.json(agenda);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar agenda existente
  update: async (req, res) => {
    try {
      const agenda = await agendaEntrenamientos.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      if (!agenda) return res.status(404).json({ message: 'Agenda no encontrada' });

      await agenda.update(req.body);
      res.json(agenda);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar agenda (eliminación lógica)
  delete: async (req, res) => {
    try {
      const agenda = await agendaEntrenamientos.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      if (!agenda) return res.status(404).json({ message: 'Agenda no encontrada' });

      await agenda.update({ estado: false });
      res.json({ message: 'Agenda eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = agendaEntrenamientosCtl;
