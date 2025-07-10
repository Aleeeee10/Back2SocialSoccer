const orm = require('../dataBase/dataBase.orm');
const standingsController = {};

standingsController.listar = async (req, res) => {
  try {
    const standings = await orm.standings.findAll({
      include: [{ model: orm.teams, as: 'team' }]
    });
    res.json(standings);
  } catch (err) {
    console.error("Error al listar posiciones", err);
    res.status(500).json({ error: "Error interno" });
  }
};

standingsController.crear = async (req, res) => {
  const t = await orm.sequelize.transaction();
  try {
    const {
      teamId,
      games_played,
      wins,
      draws,
      losses,
      goals_for,
      goals_against,
      points
    } = req.body;
    const nuevaPosicion = await orm.standings.create(
      {
        teamId,
        games_played,
        wins,
        draws,
        losses,
        goals_for,
        goals_against,
        points
      },
      { transaction: t }
    );
    await t.commit();
    res.status(201).json(nuevaPosicion);
  } catch (err) {
    await t.rollback();
    console.error("Error al crear posicion", err);
    res.status(500).json({ error: "Error interno" });
  }
};

standingsController.actualizar = async (req, res) => {
  const t = await orm.sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      teamId,
      games_played,
      wins,
      draws,
      losses,
      goals_for,
      goals_against,
      points
    } = req.body;
    const posicion = await orm.standings.findByPk(id);
    if (!posicion) {
      return res.status(404).json({ error: "Posicion no encontrada" });
    }
    await posicion.update(
      {
        teamId,
        games_played,
        wins,
        draws,
        losses,
        goals_for,
        goals_against,
        points
      },
      { transaction: t }
    );
    await t.commit();
    res.json(posicion);
  } catch (err) {
    await t.rollback();
    console.error("Error al actualizar posicion", err);
    res.status(500).json({ error: "Error interno" });
  }
};

standingsController.eliminar = async (req, res) => {
  const t = await orm.sequelize.transaction();
  try {
    const { id } = req.params;
    const posicion = await orm.standings.findByPk(id);
    if (!posicion) {
      return res.status(404).json({ error: "Posicion no encontrada" });
    }
    await posicion.destroy({ transaction: t });
    await t.commit();
    res.status(204).send();
  } catch (err) {
    await t.rollback();
    console.error("Error al eliminar posicion", err);
    res.status(500).json({ error: "Error interno" });
  }
};

module.exports = standingsController;
