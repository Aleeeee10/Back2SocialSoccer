const { detalleDivision } = require('../dataBase/dataBase.orm');

// Obtener todos los registros
exports.getAll = async (req, res) => {
  try {
    const detalles = await detalleDivision.findAll();
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener registro por ID
exports.getById = async (req, res) => {
  try {
    const detalle = await detalleDivision.findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ message: 'No encontrado' });
    res.json(detalle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo registro
exports.create = async (req, res) => {
  try {
    const newDetalle = await detalleDivision.create(req.body);
    res.status(201).json(newDetalle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar registro existente
exports.update = async (req, res) => {
  try {
    const detalle = await detalleDivision.findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ message: 'No encontrado' });

    await detalle.update(req.body);
    res.json(detalle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar registro
exports.delete = async (req, res) => {
  try {
    const detalle = await detalleDivision.findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ message: 'No encontrado' });

    await detalle.destroy();
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
