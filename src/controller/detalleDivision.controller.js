const orm = require('../dataBase/dataBase.orm');
const detalleDivisionController = {};

detalleDivisionController.listar = async (req, res) => {
  try {
    const detalles = await orm.detalleDivision.findAll({
      include: [
        { model: orm.players },
        { model: orm.division }
      ]
    });
    res.json(detalles);
  } catch (error) {
    console.error('Error al listar detalles de división:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

detalleDivisionController.crear = async (req, res) => {
  try {
    const { playerId, divisionId, status, note } = req.body;
    const nuevo = await orm.detalleDivision.create({ playerId, divisionId, status, note });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear detalle:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

detalleDivisionController.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await orm.detalleDivision.update(data, { where: { id } });
    res.json({ mensaje: 'Detalle actualizado' });
  } catch (error) {
    console.error('Error al actualizar detalle:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

detalleDivisionController.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.detalleDivision.destroy({ where: { id } });
    res.json({ mensaje: 'Detalle eliminado' });
  } catch (error) {
    console.error('Error al eliminar detalle:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = detalleDivisionController;
