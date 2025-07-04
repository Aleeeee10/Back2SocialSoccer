const orm = require('../dataBase/dataBase.orm');
const controller = {};

controller.listar = async (req, res) => {
  try {
    const data = await orm.estadisticas.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error al listar estadísticas:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.crear = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const nueva = await orm.estadisticas.create({ nombre, descripcion });
    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al crear estadística:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.estadisticas.update(req.body, { where: { id } });
    res.json({ mensaje: 'Estadística actualizada' });
  } catch (error) {
    console.error('Error al actualizar estadística:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

controller.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await orm.estadisticas.destroy({ where: { id } });
    res.json({ mensaje: 'Estadística eliminada' });
  } catch (error) {
    console.error('Error al eliminar estadística:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = controller;
