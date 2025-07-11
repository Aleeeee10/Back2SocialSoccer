const orm = require('../dataBase/dataBase.orm');

const dashboardController = {};

dashboardController.resumen = async (req, res) => {
  try {
    const [
      users,
      players,
      teams,
      matches,
      referees,
      news,
      recentMatches
    ] = await Promise.all([
      orm.users.count(),
      orm.players.count(),
      orm.teams.count(),
      orm.matches.count(),
      orm.referees.count(),
      orm.news.count(),
      orm.matches.findAll({
        limit: 5,
        order: [['date', 'DESC']]
      })
    ]);

    const datos = {
      totals: {
        users,
        players,
        teams,
        matches,
        referees,
        news
      },
      recent: {
        matches: recentMatches.map(match => ({
          id: match.id,
          date: match.date,
          description: match.description || 'Partido sin descripción'
        }))
      }
    };

    res.json(datos);
  } catch (error) {
    console.error('Error en dashboard:', error);
    res.status(500).json({ error: 'Error al obtener resumen' });
  }
};

module.exports = dashboardController;
