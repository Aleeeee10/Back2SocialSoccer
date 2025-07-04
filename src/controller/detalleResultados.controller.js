const orm = require('../dataBase/dataBase.orm');
const controller = {};

controller.listar = async (req, res) => {
  try {
    const data = await orm.detalleResultados.findAll({
      include: [orm.players, orm.resultados]
    });
    res.json(data);
  } catch (error) {
    console.error('Error al listar detalles de resultado:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.crear = async (req, res) => {
  try {
    const { resultadoId, playerId, goles, asistencia } = req.body;
    const nuevo = await orm.detalleResultados.create({ resultadoId, playerId, goles, asistencia });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear detalle de resultado:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.detalleResultados.update(req.body, { where: { id } });
    res.json({ mensaje: 'Detalle actualizado' });
  } catch (error) {
    console.error('Error al actualizar detalle:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.detalleResultados.destroy({ where: { id } });
    res.json({ mensaje: 'Detalle eliminado' });
  } catch (error) {
    console.error('Error al eliminar detalle:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = controller;
