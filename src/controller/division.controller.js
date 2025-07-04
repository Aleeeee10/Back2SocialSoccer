const orm = require('../dataBase/dataBase.orm');
const divisionController = {};

divisionController.listar = async (req, res) => {
  try {
    const data = await orm.division.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error al listar divisiones:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

divisionController.crear = async (req, res) => {
  try {
    const { name, description } = req.body;
    const nueva = await orm.division.create({ name, description });
    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al crear división:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

divisionController.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await orm.division.update({ name, description }, { where: { id } });
    res.json({ mensaje: 'División actualizada' });
  } catch (error) {
    console.error('Error al actualizar división:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

divisionController.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.division.destroy({ where: { id } });
    res.json({ mensaje: 'División eliminada' });
  } catch (error) {
    console.error('Error al eliminar división:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = divisionController;
