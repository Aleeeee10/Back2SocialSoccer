// controller/posicionesController.js
const posiciones = require('../model/relational/posiciones'); // ruta correcta al modelo

exports.getAll = async (req, res) => {
  try {
    const allPosiciones = await posiciones.findAll();
    res.json(allPosiciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const posicion = await posiciones.findByPk(req.params.id);
    if (!posicion) return res.status(404).json({ message: 'Posición no encontrada' });
    res.json(posicion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newPosicion = await posiciones.create(req.body);
    res.status(201).json(newPosicion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await posiciones.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'Posición no encontrada' });
    const updatedPosicion = await posiciones.findByPk(req.params.id);
    res.json(updatedPosicion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await posiciones.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Posición no encontrada' });
    res.json({ message: 'Posición eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
