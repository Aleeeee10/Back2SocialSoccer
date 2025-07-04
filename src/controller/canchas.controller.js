const orm = require('../dataBase/dataBase.orm');
const controller = {};

controller.listar = async (req, res) => {
  try {
    const data = await orm.canchas.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error al listar canchas:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.crear = async (req, res) => {
  try {
    const { nombre, direccion, tipo } = req.body;
    const nueva = await orm.canchas.create({ nombre, direccion, tipo });
    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al crear cancha:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.canchas.update(req.body, { where: { id } });
    res.json({ mensaje: 'Cancha actualizada' });
  } catch (error) {
    console.error('Error al actualizar cancha:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.canchas.destroy({ where: { id } });
    res.json({ mensaje: 'Cancha eliminada' });
  } catch (error) {
    console.error('Error al eliminar cancha:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = controller;
