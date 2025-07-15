const UserPreferences = require('../model/nonRelational/UserPreferences');

// Obtener todas las preferencias
exports.getAll = async (req, res) => {
  try {
    const preferences = await UserPreferences.find();
    res.status(200).json(preferences);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las preferencias', error });
  }
};

// Obtener una por ID de usuario
exports.getByUserId = async (req, res) => {
  try {
    const pref = await UserPreferences.findOne({ userId: req.params.userId });
    if (!pref) return res.status(404).json({ message: 'Preferencias no encontradas' });
    res.status(200).json(pref);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar preferencias', error });
  }
};

// Crear nuevas preferencias
exports.create = async (req, res) => {
  try {
    const newPref = new UserPreferences(req.body);
    const saved = await newPref.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear preferencias', error });
  }
};

// Actualizar por ID de usuario
exports.updateByUserId = async (req, res) => {
  try {
    const updated = await UserPreferences.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Preferencias no encontradas' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar preferencias', error });
  }
};

// Eliminar por ID de usuario
exports.deleteByUserId = async (req, res) => {
  try {
    const deleted = await UserPreferences.findOneAndDelete({ userId: req.params.userId });
    if (!deleted) return res.status(404).json({ message: 'Preferencias no encontradas' });
    res.status(200).json({ message: 'Preferencias eliminadas' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar preferencias', error });
  }
};
