const orm = require('../dataBase/dataBase.orm');
const controller = {};

controller.listar = async (req, res) => {
  try {
    const data = await orm.detalleJugadores.findAll({
      include: [orm.players]
    });
    res.json(data);
  } catch (error) {
    console.error('Error al listar detalle jugadores:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.crear = async (req, res) => {
  try {
    const { playerId, edad, estatura, peso, categoria } = req.body;
    const nuevo = await orm.detalleJugadores.create({ playerId, edad, estatura, peso, categoria });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear detalle:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.detalleJugadores.update(req.body, { where: { id } });
    res.json({ mensaje: 'Detalle actualizado' });
  } catch (error) {
    console.error('Error al actualizar detalle:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.detalleJugadores.destroy({ where: { id } });
    res.json({ mensaje: 'Detalle eliminado' });
  } catch (error) {
    console.error('Error al eliminar detalle:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = controller;
