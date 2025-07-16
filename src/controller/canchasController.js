const { canchas } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encryptDates } = require('../lib/helpers');

const canchasCtl = {
  // Obtener todas las canchas usando ORM
  getAllCanchas: async (req, res) => {
    try {
      const data = await canchas.findAll({
        where: { estado: true }
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mostrar canchas usando SQL directo con información completa
  mostrarCanchas: async (req, res) => {
    try {
      const query = `
        SELECT c.*, 
               COUNT(m.id) as total_partidos,
               COUNT(CASE WHEN m.fecha >= CURDATE() THEN 1 END) as partidos_programados
        FROM canchas c
        LEFT JOIN matches m ON c.id = m.canchaId AND m.estado = true
        WHERE c.estado = true
        GROUP BY c.id, c.nombre, c.ubicacion, c.estado
        ORDER BY c.nombre
      `;
      const data = await pool.query(query);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear nueva cancha usando ORM
  createCancha: async (req, res) => {
    try {
      const newCancha = await canchas.create({
        ...req.body,
        estado: true
      });
      res.status(201).json(newCancha);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Mandar cancha específica con encriptación
  mandarCancha: async (req, res) => {
    try {
      const cancha = await canchas.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      
      if (!cancha) {
        return res.status(404).json({ message: 'Cancha no encontrada' });
      }

      const encryptedCancha = encryptDates(cancha.toJSON());
      res.json(encryptedCancha);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener cancha por ID
  getById: async (req, res) => {
    try {
      const cancha = await canchas.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      if (!cancha) return res.status(404).json({ message: 'Cancha no encontrada' });
      res.json(cancha);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar cancha existente
  update: async (req, res) => {
    try {
      const cancha = await canchas.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      if (!cancha) return res.status(404).json({ message: 'Cancha no encontrada' });

      await cancha.update(req.body);
      res.json(cancha);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar cancha (eliminación lógica)
  delete: async (req, res) => {
    try {
      const cancha = await canchas.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      if (!cancha) return res.status(404).json({ message: 'Cancha no encontrada' });

      await cancha.update({ estado: false });
      res.json({ message: 'Cancha eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = canchasCtl;
