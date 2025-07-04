const orm = require('../dataBase/dataBase.orm');
const controller = {};

controller.listar = async (req, res) => {
  try {
    const data = await orm.detalleEstadisticas.findAll({
      include: [
        { model: orm.players },
        { model: orm.estadisticas }
      ]
    });
    res.json(data);
  } catch (error) {
    console.error('Error al listar detalleEstadisticas:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.crear = async (req, res) => {
  try {
    const { playerId, estadisticaId, valor } = req.body;
    const nuevo = await orm.detalleEstadisticas.create({ playerId, estadisticaId, valor });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear detalleEstadistica:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.detalleEstadisticas.update(req.body, { where: { id } });
    res.json({ mensaje: 'Detalle actualizado' });
  } catch (error) {
    console.error('Error al actualizar detalle:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.detalleEstadisticas.destroy({ where: { id } });
    res.json({ mensaje: 'Detalle eliminado' });
  } catch (error) {
    console.error('Error al eliminar detalle:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = controller;
