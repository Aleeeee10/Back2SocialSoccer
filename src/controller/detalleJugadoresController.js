// src/controller/detalleJugadoresController.js

// Aquí importas el modelo correspondiente si tienes (ajusta el path)
const { detalleJugadores } = require('../model/relational/detalleJugadores');

module.exports = {
  getAll: async (req, res) => {
    try {
      const detalles = await detalleJugadores.findAll();
      res.json(detalles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const detalle = await detalleJugadores.findByPk(req.params.id);
      if (!detalle) {
        return res.status(404).json({ message: 'Detalle jugador no encontrado' });
      }
      res.json(detalle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const nuevoDetalle = await detalleJugadores.create(req.body);
      res.status(201).json(nuevoDetalle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const detalle = await detalleJugadores.findByPk(req.params.id);
      if (!detalle) {
        return res.status(404).json({ message: 'Detalle jugador no encontrado' });
      }
      await detalle.update(req.body);
      res.json(detalle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const detalle = await detalleJugadores.findByPk(req.params.id);
      if (!detalle) {
        return res.status(404).json({ message: 'Detalle jugador no encontrado' });
      }
      await detalle.destroy();
      res.json({ message: 'Detalle jugador eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
