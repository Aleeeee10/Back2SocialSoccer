const orm = require('../dataBase/dataBase.orm');
const controller = {};

controller.listar = async (req, res) => {
  try {
    const data = await orm.resultados.findAll({
      include: [orm.matches]
    });
    res.json(data);
  } catch (error) {
    console.error('Error al listar resultados:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.crear = async (req, res) => {
  try {
    const { matchId, team1_goals, team2_goals, winner } = req.body;
    const nuevo = await orm.resultados.create({ matchId, team1_goals, team2_goals, winner });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear resultado:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.resultados.update(req.body, { where: { id } });
    res.json({ mensaje: 'Resultado actualizado' });
  } catch (error) {
    console.error('Error al actualizar resultado:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.resultados.destroy({ where: { id } });
    res.json({ mensaje: 'Resultado eliminado' });
  } catch (error) {
    console.error('Error al eliminar resultado:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = controller;
