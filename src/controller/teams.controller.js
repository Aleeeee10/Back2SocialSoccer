const orm = require('../dataBase/dataBase.orm');
const teamsController = {};

teamsController.listar = async (req, res) => {
  try {
    const teams = await orm.teams.findAll();
    res.json(teams);
  } catch (err) {
    console.error("Error al listar equipos", err);
    res.status(500).json({ error: "Error interno" });
  }
};

teamsController.crear = async (req, res) => {
  try {
    const { name, logo_url, division } = req.body;
    const nuevo = await orm.teams.create({ name, logo_url, division });
    res.status(201).json(nuevo);
  } catch (err) {
    console.error("Error al crear equipo", err);
    res.status(500).json({ error: "Error interno" });
  }
};

teamsController.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo_url, division } = req.body;
    await orm.teams.update({ name, logo_url, division }, { where: { id } });
    res.json({ mensaje: "Equipo actualizado" });
  } catch (err) {
    console.error("Error al actualizar", err);
    res.status(500).json({ error: "Error interno" });
  }
};

teamsController.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.teams.destroy({ where: { id } });
    res.json({ mensaje: "Equipo eliminado" });
  } catch (err) {
    console.error("Error al eliminar", err);
    res.status(500).json({ error: "Error interno" });
  }
};

module.exports = teamsController;
