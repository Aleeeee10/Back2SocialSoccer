const orm = require('../dataBase/dataBase.orm');
const matchesController = {};

matchesController.listar = async (req, res) => {
  try {
    const matches = await orm.matches.findAll({
      include: [
        { model: orm.teams, as: 'team1' },
        { model: orm.teams, as: 'team2' },
        { model: orm.referees, as: 'referee' }
      ]
    });
    res.json(matches);
  } catch (error) {
    console.error("Error al listar partidos:", error);
    res.status(500).json({ error: 'Error al obtener partidos' });
  }
};

matchesController.crear = async (req, res) => {
  try {
    const { date, hour, location, team1, team2, referee } = req.body;
    const nuevo = await orm.matches.create({
      date,
      hour,
      location,
      team1Id: team1.id,
      team2Id: team2.id,
      refereeId: referee?.id || null
    });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error al crear partido:", error);
    res.status(500).json({ error: 'Error al crear partido' });
  }
};

matchesController.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, hour, location, team1, team2, referee } = req.body;
    await orm.matches.update(
      {
        date,
        hour,
        location,
        team1Id: team1.id,
        team2Id: team2.id,
        refereeId: referee?.id || null
      },
      { where: { id } }
    );
    res.json({ mensaje: 'Partido actualizado' });
  } catch (error) {
    console.error("Error al actualizar partido:", error);
    res.status(500).json({ error: 'Error al actualizar partido' });
  }
};

matchesController.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.matches.destroy({ where: { id } });
    res.json({ mensaje: 'Partido eliminado' });
  } catch (error) {
    console.error("Error al eliminar partido:", error);
    res.status(500).json({ error: 'Error al eliminar partido' });
  }
};

module.exports = matchesController;
