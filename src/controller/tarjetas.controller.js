const orm = require('../dataBase/dataBase.orm');
const controller = {};

controller.listar = async (req, res) => {
  try {
    const data = await orm.tarjetas.findAll({
      include: [orm.players, orm.matches]
    });
    res.json(data);
  } catch (error) {
    console.error('Error al listar tarjetas:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.crear = async (req, res) => {
  try {
    const { playerId, matchId, tipo, minuto } = req.body;
    const nueva = await orm.tarjetas.create({ playerId, matchId, tipo, minuto });
    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al crear tarjeta:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.tarjetas.update(req.body, { where: { id } });
    res.json({ mensaje: 'Tarjeta actualizada' });
  } catch (error) {
    console.error('Error al actualizar tarjeta:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.tarjetas.destroy({ where: { id } });
    res.json({ mensaje: 'Tarjeta eliminada' });
  } catch (error) {
    console.error('Error al eliminar tarjeta:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = controller;
