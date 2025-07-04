const orm = require('../dataBase/dataBase.orm');
const playersController = {};

// Obtener todos los jugadores con sus equipos
playersController.listar = async (req, res) => {
  try {
    const players = await orm.players.findAll({
      include: orm.teams
    });
    res.json(players);
  } catch (error) {
    console.error('Error al listar jugadores:', error);
    res.status(500).json({ error: 'Error al obtener jugadores' });
  }
};

// Crear un nuevo jugador
playersController.crear = async (req, res) => {
  try {
    const { name, photo_url, number, position, team } = req.body;
    const nuevo = await orm.players.create({
      name,
      photo_url,
      number,
      position,
      teamId: team.id
    });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear jugador:', error);
    res.status(500).json({ error: 'Error al crear jugador' });
  }
};

// Actualizar jugador
playersController.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, photo_url, number, position, team } = req.body;

    await orm.players.update(
      {
        name,
        photo_url,
        number,
        position,
        teamId: team.id
      },
      { where: { id } }
    );

    res.json({ mensaje: 'Jugador actualizado' });
  } catch (error) {
    console.error('Error al actualizar jugador:', error);
    res.status(500).json({ error: 'Error al actualizar jugador' });
  }
};

// Eliminar jugador
playersController.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.players.destroy({ where: { id } });
    res.json({ mensaje: 'Jugador eliminado' });
  } catch (error) {
    console.error('Error al eliminar jugador:', error);
    res.status(500).json({ error: 'Error al eliminar jugador' });
  }
};

module.exports = playersController;
