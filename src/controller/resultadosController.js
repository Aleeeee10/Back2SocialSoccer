// Controlador para resultados - siguiendo el patrón estándar del proyecto
const { resultados } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');

const resultadosCtl = {
  // Obtener todos los resultados usando ORM (para APIs)
  async getAllResultados(req, res) {
    try {
      const data = await resultados.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener resultados', error: e.message });
    }
  },

  // Mostrar resultados usando consulta SQL directa (para vistas)
  async mostrarResultados(req, res) {
    try {
      const sql = 'SELECT * FROM resultados ORDER BY id ASC';
      const resultadosData = await pool.query(sql);
      res.json(resultadosData);
    } catch (error) {
      console.error('Error al mostrar resultados:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear resultado usando ORM
  async createResultado(req, res) {
    try {
      const newRes = await resultados.create(req.body);
      res.status(201).json(newRes);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear resultado', error: e.message });
    }
  },

  // Mandar/enviar resultado (método híbrido para casos especiales)
  async mandarResultado(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const resul = await resultados.findByPk(id);
      if (!resul) {
        return res.status(404).json({ message: 'Resultado no encontrado' });
      }

      // Encriptar datos sensibles si es necesario
      const resultadoData = {
        ...resul.toJSON(),
        fechaConsulta: encrypDates(new Date())
      };

      res.json(resultadoData);
    } catch (error) {
      console.error('Error al mandar resultado:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar resultado por ID
  async getById(req, res) {
    try {
      const resul = await resultados.findByPk(req.params.id);
      if (!resul) return res.status(404).json({ message: 'Resultado no encontrado' });
      res.json(resul);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar resultado', error: e.message });
    }
  },

  // Actualizar resultado
  async update(req, res) {
    try {
      const id = req.params.id;
      const resul = await resultados.findByPk(id);
      if (!resul) return res.status(404).json({ message: 'Resultado no encontrado' });
      await resul.update(req.body);
      res.json(resul);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar resultado', error: e.message });
    }
  },

  // Eliminar resultado
  async delete(req, res) {
    try {
      const id = req.params.id;
      const resul = await resultados.findByPk(id);
      if (!resul) return res.status(404).json({ message: 'Resultado no encontrado' });
      await resul.destroy();
      res.json({ message: 'Resultado eliminado' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar resultado', error: e.message });
    }
  }
};

module.exports = resultadosCtl;
