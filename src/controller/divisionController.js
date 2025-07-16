// Controlador para division - siguiendo el patrón estándar del proyecto
const { division } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');

const divisionCtl = {
  // Obtener todas las divisiones usando ORM (para APIs)
  async getAllDivisiones(req, res) {
    try {
      const data = await division.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener divisiones', error: e.message });
    }
  },

  // Mostrar divisiones usando consulta SQL directa (para vistas)
  async mostrarDivisiones(req, res) {
    try {
      const sql = 'SELECT * FROM divisions ORDER BY categoria ASC, nombre ASC';
      const divisionesData = await pool.query(sql);
      res.json(divisionesData);
    } catch (error) {
      console.error('Error al mostrar divisiones:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear división usando ORM
  async createDivision(req, res) {
    try {
      const newDiv = await division.create(req.body);
      res.status(201).json(newDiv);
    } catch (e) {
      res.status(400).json({ message: 'Error al crear división', error: e.message });
    }
  },

  // Mandar/enviar división (método híbrido para casos especiales)
  async mandarDivision(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const div = await division.findByPk(id);
      if (!div) {
        return res.status(404).json({ message: 'División no encontrada' });
      }

      // Encriptar datos sensibles si es necesario
      const divisionData = {
        ...div.toJSON(),
        fechaConsulta: encrypDates(new Date())
      };

      res.json(divisionData);
    } catch (error) {
      console.error('Error al mandar división:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar división por ID
  async getById(req, res) {
    try {
      const div = await division.findByPk(req.params.id);
      if (!div) return res.status(404).json({ message: 'División no encontrada' });
      res.json(div);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar división', error: e.message });
    }
  },

  // Actualizar división
  async update(req, res) {
    try {
      const id = req.params.id;
      const div = await division.findByPk(id);
      if (!div) return res.status(404).json({ message: 'División no encontrada' });
      await div.update(req.body);
      res.json(div);
    } catch (e) {
      res.status(400).json({ message: 'Error al actualizar división', error: e.message });
    }
  },

  // Eliminar división
  async delete(req, res) {
    try {
      const id = req.params.id;
      const div = await division.findByPk(id);
      if (!div) return res.status(404).json({ message: 'División no encontrada' });
      await div.destroy();
      res.json({ message: 'División eliminada' });
    } catch (e) {
      res.status(500).json({ message: 'Error al eliminar división', error: e.message });
    }
  }
};

module.exports = divisionCtl;
