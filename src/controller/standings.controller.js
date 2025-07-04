const orm = require('../dataBase/dataBase.orm');
const standingsController = {};

standingsController.listar = async (req, res) => {
  try {
    const data = await orm.standings.findAll({
      include: [
        { model: orm.teams },
        { model: orm.division }
      ]
    });
    res.json(data);
  } catch (error) {
    console.error('Error al listar posiciones:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

standingsController.crear = async (req, res) => {
  try {
    const { teamId, divisionId, games_played, wins, losses, draws, goals_for, goals_against, points } = req.body;
    const nuevo = await orm.standings.create({
      teamId,
      divisionId,
      games_played,
      wins,
      losses,
      draws,
      goals_for,
      goals_against,
      points
    });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear posición:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

standingsController.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await orm.standings.update(data, { where: { id } });
    res.json({ mensaje: 'Posición actualizada' });
  } catch (error) {
    console.error('Error al actualizar posición:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

standingsController.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.standings.destroy({ where: { id } });
    res.json({ mensaje: 'Posición eliminada' });
  } catch (error) {
    console.error('Error al eliminar posición:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = standingsController;
