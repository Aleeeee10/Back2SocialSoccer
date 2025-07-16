// Controlador para news - siguiendo el patrón estándar del proyecto
const { news } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');

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
      const newItem = await news.create(req.body);
      res.status(201).json(newItem);
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
      await newItem.destroy();
      res.json({ message: 'Noticia eliminada' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar noticia', error: e.message });
    }
  }
};

module.exports = newsCtl;
