// Controlador para news - siguiendo el patrón estándar del proyecto
const { news } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');
const Favorito = require('../model/nonRelational/favoritos');

const newsCtl = {
  // Obtener todas las noticias usando ORM (para APIs)
  async getAllNews(req, res) {
    try {
      const data = await news.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener noticias', error: e.message });
    }
  },

  // Mostrar noticias usando consulta SQL directa (para vistas)
  async mostrarNews(req, res) {
    try {
      const sql = 'SELECT * FROM news ORDER BY fecha DESC';
      const newsData = await pool.query(sql);
      res.json(newsData);
    } catch (error) {
      console.error('Error al mostrar noticias:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear noticia usando ORM
  async createNews(req, res) {
    try {
      const { titulo, contenido, autor, categoria = 'general', etiquetas = [] } = req.body;
      
      // Crear noticia en MySQL
      const newNoticia = await news.create({
        titulo,
        contenido,
        autor,
        fecha: new Date(),
        estado: true
      });

      // Crear registro inicial en favoritos (para estadísticas)
      const favoritoStats = new Favorito({
        newsId: newNoticia.id,
        userId: 0, // Usuario del sistema para estadísticas
        tipoEntidad: 'noticia_stats',
        entidadId: newNoticia.id,
        etiquetas: ['estadisticas', 'nueva'],
        notas: `Noticia creada: ${titulo}`,
        fechaMarcado: new Date(),
        prioridad: 'normal',
        contadorVistas: 0,
        estado: true
      });

      await favoritoStats.save();

      res.status(201).json({
        message: 'Noticia y registro de estadísticas creados exitosamente',
        noticia: newNoticia,
        statsId: favoritoStats._id
      });
    } catch (e) {
      res.status(400).json({ message: 'Error al crear noticia', error: e.message });
    }
  },

  // Mandar/enviar noticia (método híbrido para casos especiales)
  async mandarNews(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const newItem = await news.findByPk(id);
      if (!newItem) {
        return res.status(404).json({ message: 'Noticia no encontrada' });
      }

      // Encriptar datos sensibles si es necesario
      const newsData = {
        ...newItem.toJSON(),
        fechaConsulta: encrypDates(new Date())
      };

      res.json(newsData);
    } catch (error) {
      console.error('Error al mandar noticia:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar noticia por ID
  async getById(req, res) {
    try {
      const newItem = await news.findByPk(req.params.id);
      if (!newItem) return res.status(404).json({ message: 'Noticia no encontrada' });
      res.json(newItem);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar noticia', error: e.message });
    }
  },

  // Actualizar noticia
  async update(req, res) {
    try {
      const id = req.params.id;
      const newItem = await news.findByPk(id);
      if (!newItem) return res.status(404).json({ message: 'Noticia no encontrada' });
      await newItem.update(req.body);
      res.json(newItem);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar noticia', error: e.message });
    }
  },

  // Eliminar noticia
  async delete(req, res) {
    try {
      const id = req.params.id;
      const newItem = await news.findByPk(id);
      if (!newItem) return res.status(404).json({ message: 'Noticia no encontrada' });
      
      // Desactivar favoritos relacionados (eliminación lógica)
      await Favorito.updateMany(
        { newsId: parseInt(id) },
        { estado: false }
      );
      
      await newItem.destroy();
      res.json({ message: 'Noticia y favoritos relacionados eliminados exitosamente' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar noticia', error: e.message });
    }
  },

  // FUNCIONES ESPECÍFICAS PARA FAVORITOS (MongoDB)

  // Obtener favoritos de una noticia específica
  async getNewsFavoritos(req, res) {
    try {
      const { newsId } = req.params;
      const favoritos = await Favorito.find({ 
        newsId: parseInt(newsId), 
        estado: true,
        tipoEntidad: 'noticia'
      }).sort({ fechaMarcado: -1 });
      res.json(favoritos);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener favoritos', error: e.message });
    }
  },

  // Obtener noticia completa con información de favoritos
  async getNewsWithFavoritos(req, res) {
    try {
      const { newsId } = req.params;
      
      // Obtener noticia de MySQL
      const noticia = await news.findByPk(newsId);
      if (!noticia) return res.status(404).json({ message: 'Noticia no encontrada' });
      
      // Obtener favoritos de MongoDB
      const favoritos = await Favorito.find({ 
        newsId: parseInt(newsId), 
        estado: true,
        tipoEntidad: 'noticia'
      }).sort({ fechaMarcado: -1 });
      
      // Obtener estadísticas
      const totalFavoritos = favoritos.length;
      const vistasTotales = favoritos.reduce((sum, fav) => sum + fav.contadorVistas, 0);
      const valoracionPromedio = favoritos.length > 0 
        ? favoritos.filter(f => f.valoracion).reduce((sum, f) => sum + f.valoracion, 0) / favoritos.filter(f => f.valoracion).length 
        : 0;
      
      res.json({
        noticia,
        favoritos,
        estadisticas: {
          totalFavoritos,
          vistasTotales,
          valoracionPromedio: valoracionPromedio.toFixed(1),
          usuariosUnicos: new Set(favoritos.map(f => f.userId)).size
        }
      });
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener datos completos', error: e.message });
    }
  },

  // Marcar noticia como favorita
  async addToFavorites(req, res) {
    try {
      const { newsId } = req.params;
      const { userId, etiquetas, notas, prioridad, valoracion } = req.body;
      
      // Verificar si ya existe este favorito
      const existingFavorito = await Favorito.findOne({
        newsId: parseInt(newsId),
        userId: parseInt(userId),
        tipoEntidad: 'noticia',
        estado: true
      });
      
      if (existingFavorito) {
        return res.status(400).json({ message: 'Esta noticia ya está en favoritos' });
      }
      
      const nuevoFavorito = new Favorito({
        newsId: parseInt(newsId),
        userId: parseInt(userId),
        tipoEntidad: 'noticia',
        entidadId: parseInt(newsId),
        etiquetas: etiquetas || [],
        notas: notas || '',
        fechaMarcado: new Date(),
        prioridad: prioridad || 'normal',
        valoracion: valoracion || null,
        contadorVistas: 1,
        ultimaVista: new Date(),
        estado: true
      });
      
      await nuevoFavorito.save();
      res.json({ message: 'Noticia agregada a favoritos', favorito: nuevoFavorito });
    } catch (e) {
      res.status(400).json({ message: 'Error al agregar a favoritos', error: e.message });
    }
  },

  // Remover noticia de favoritos
  async removeFromFavorites(req, res) {
    try {
      const { newsId, userId } = req.params;
      
      const updatedFavorito = await Favorito.findOneAndUpdate(
        { 
          newsId: parseInt(newsId), 
          userId: parseInt(userId),
          tipoEntidad: 'noticia',
          estado: true 
        },
        { estado: false },
        { new: true }
      );
      
      if (!updatedFavorito) return res.status(404).json({ message: 'Favorito no encontrado' });
      res.json({ message: 'Noticia removida de favoritos' });
    } catch (e) {
      res.status(400).json({ message: 'Error al remover de favoritos', error: e.message });
    }
  },

  // Registrar vista de favorito
  async registerFavoriteView(req, res) {
    try {
      const { newsId, userId } = req.params;
      
      const favorito = await Favorito.findOne({
        newsId: parseInt(newsId),
        userId: parseInt(userId),
        tipoEntidad: 'noticia',
        estado: true
      });
      
      if (favorito) {
        favorito.contadorVistas += 1;
        favorito.ultimaVista = new Date();
        await favorito.save();
      }
      
      res.json({ message: 'Vista registrada', vistas: favorito?.contadorVistas || 0 });
    } catch (e) {
      res.status(400).json({ message: 'Error al registrar vista', error: e.message });
    }
  },

  // Actualizar favorito (etiquetas, notas, valoración)
  async updateFavorite(req, res) {
    try {
      const { newsId, userId } = req.params;
      const { etiquetas, notas, prioridad, valoracion } = req.body;
      
      const updatedFavorito = await Favorito.findOneAndUpdate(
        { 
          newsId: parseInt(newsId), 
          userId: parseInt(userId),
          tipoEntidad: 'noticia',
          estado: true 
        },
        { 
          etiquetas: etiquetas || [],
          notas: notas || '',
          prioridad: prioridad || 'normal',
          valoracion: valoracion || null
        },
        { new: true }
      );
      
      if (!updatedFavorito) return res.status(404).json({ message: 'Favorito no encontrado' });
      res.json({ message: 'Favorito actualizado', favorito: updatedFavorito });
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar favorito', error: e.message });
    }
  },

  // Obtener favoritos de un usuario
  async getUserFavorites(req, res) {
    try {
      const { userId } = req.params;
      const { etiqueta, prioridad, limite = 20, pagina = 1 } = req.query;
      
      const filtros = {
        userId: parseInt(userId),
        tipoEntidad: 'noticia',
        estado: true
      };
      
      if (etiqueta) filtros.etiquetas = { $in: [etiqueta] };
      if (prioridad) filtros.prioridad = prioridad;
      
      const favoritos = await Favorito.find(filtros)
        .sort({ fechaMarcado: -1 })
        .limit(parseInt(limite))
        .skip((parseInt(pagina) - 1) * parseInt(limite));
      
      res.json(favoritos);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener favoritos del usuario', error: e.message });
    }
  },

  // Obtener estadísticas de favoritos para noticias
  async getFavoriteStats(req, res) {
    try {
      const stats = await Favorito.aggregate([
        { 
          $match: { 
            tipoEntidad: 'noticia', 
            estado: true,
            userId: { $ne: 0 } // Excluir estadísticas del sistema
          } 
        },
        {
          $group: {
            _id: '$newsId',
            totalFavoritos: { $sum: 1 },
            vistasTotales: { $sum: '$contadorVistas' },
            valoracionPromedio: { $avg: '$valoracion' },
            ultimaActividad: { $max: '$ultimaVista' }
          }
        },
        { $sort: { totalFavoritos: -1 } },
        { $limit: 10 }
      ]);
      
      res.json({
        noticiasPopulares: stats,
        resumen: {
          totalNoticias: stats.length,
          promedioFavoritos: stats.reduce((sum, s) => sum + s.totalFavoritos, 0) / stats.length || 0
        }
      });
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener estadísticas', error: e.message });
    }
  }
};

module.exports = newsCtl;
