const orm = require('../dataBase/dataBase.orm');
const refereesController = {};

refereesController.listar = async (req, res) => {
  try {
    const data = await orm.referees.findAll();
    res.json(data);
  } catch (error) {
    console.error("Error al listar árbitros:", error);
    res.status(500).json({ error: 'Error al obtener árbitros' });
  }
};

refereesController.crear = async (req, res) => {
  try {
    const { name, photo_url, nationality, age } = req.body;
    const nuevo = await orm.referees.create({ name, photo_url, nationality, age });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error al crear árbitro:", error);
    res.status(500).json({ error: 'Error al crear árbitro' });
  }
};

refereesController.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, photo_url, nationality, age } = req.body;
    await orm.referees.update(
      { name, photo_url, nationality, age },
      { where: { id } }
    );
    res.json({ mensaje: "Árbitro actualizado" });
  } catch (error) {
    console.error("Error al actualizar árbitro:", error);
    res.status(500).json({ error: 'Error al actualizar árbitro' });
  }
};

refereesController.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.referees.destroy({ where: { id } });
    res.json({ mensaje: "Árbitro eliminado" });
  } catch (error) {
    console.error("Error al eliminar árbitro:", error);
    res.status(500).json({ error: 'Error al eliminar árbitro' });
  }
};

module.exports = refereesController;
