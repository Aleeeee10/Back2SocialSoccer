const { detalleDivision } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encryptDates } = require('../lib/helpers');

const detalleDivisionCtl = {
  // Obtener todos los registros usando ORM
  getAllDetalleDivision: async (req, res) => {
    try {
      const detalles = await detalleDivision.findAll({
        where: { estado: true }
      });
      res.json(detalles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mostrar registros usando SQL directo con información completa
  mostrarDetalleDivision: async (req, res) => {
    try {
      const query = `
        SELECT dd.*, 
               d.nombre as division_nombre,
               p.nombre as jugador_nombre,
               p.apellido as jugador_apellido
        FROM detalleDivisions dd
        LEFT JOIN divisions d ON dd.divisionId = d.id
        LEFT JOIN players p ON dd.playerId = p.id
        WHERE dd.estado = true
        ORDER BY d.nombre, p.apellido, p.nombre
      `;
      const detalles = await pool.query(query);
      res.json(detalles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear nuevo registro usando ORM
  createDetalleDivision: async (req, res) => {
    try {
      const newDetalle = await detalleDivision.create({
        ...req.body,
        estado: true
      });
      res.status(201).json(newDetalle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mandar registro específico con encriptación
  mandarDetalleDivision: async (req, res) => {
    try {
      const detalle = await detalleDivision.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      
      if (!detalle) {
        return res.status(404).json({ message: 'Detalle de división no encontrado' });
      }

      const encryptedDetalle = encryptDates(detalle.toJSON());
      res.json(encryptedDetalle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener registro por ID
  getById: async (req, res) => {
    try {
      const detalle = await detalleDivision.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      if (!detalle) return res.status(404).json({ message: 'No encontrado' });
      res.json(detalle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar registro existente
  update: async (req, res) => {
    try {
      const detalle = await detalleDivision.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      if (!detalle) return res.status(404).json({ message: 'No encontrado' });

      await detalle.update(req.body);
      res.json(detalle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar registro (eliminación lógica)
  delete: async (req, res) => {
    try {
      const detalle = await detalleDivision.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      if (!detalle) return res.status(404).json({ message: 'No encontrado' });

      await detalle.update({ estado: false });
      res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = detalleDivisionCtl;
