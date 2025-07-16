const { comentarios } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encryptDates } = require('../lib/helpers');

const comentariosCtl = {
  // Obtener todos los comentarios usando ORM
  getAllComentarios: async (req, res) => {
    try {
      const data = await comentarios.findAll({
        where: { estado: true }
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mostrar comentarios usando SQL directo con información completa
  mostrarComentarios: async (req, res) => {
    try {
      const query = `
        SELECT c.*, 
               CASE 
                 WHEN c.tipo = 'match' THEN CONCAT('Partido: ', m.fecha)
                 WHEN c.tipo = 'team' THEN CONCAT('Equipo: ', t.nombre)
                 WHEN c.tipo = 'player' THEN CONCAT('Jugador: ', p.nombre, ' ', p.apellido)
                 WHEN c.tipo = 'news' THEN CONCAT('Noticia: ', n.titulo)
                 ELSE c.tipo
               END as entidad_info
        FROM comentarios c
        LEFT JOIN matches m ON c.tipo = 'match' AND c.entidadId = m.id
        LEFT JOIN teams t ON c.tipo = 'team' AND c.entidadId = t.id
        LEFT JOIN players p ON c.tipo = 'player' AND c.entidadId = p.id
        LEFT JOIN news n ON c.tipo = 'news' AND c.entidadId = n.id
        WHERE c.estado = true
        ORDER BY c.creadoEn DESC
      `;
      const data = await pool.query(query);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear nuevo comentario usando ORM
  createComentario: async (req, res) => {
    try {
      const newComment = await comentarios.create({
        ...req.body,
        estado: true,
        creadoEn: new Date()
      });
      res.status(201).json(newComment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Mandar comentario específico con encriptación
  mandarComentario: async (req, res) => {
    try {
      const comment = await comentarios.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      
      if (!comment) {
        return res.status(404).json({ message: 'Comentario no encontrado' });
      }

      const encryptedComment = encryptDates(comment.toJSON());
      res.json(encryptedComment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener comentario por ID
  getById: async (req, res) => {
    try {
      const comment = await comentarios.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar comentario existente
  update: async (req, res) => {
    try {
      const comment = await comentarios.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

      await comment.update(req.body);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar comentario (eliminación lógica)
  delete: async (req, res) => {
    try {
      const comment = await comentarios.findOne({
        where: { 
          id: req.params.id, 
          estado: true 
        }
      });
      if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

      await comment.update({ estado: false });
      res.json({ message: 'Comentario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = comentariosCtl;
