const HistorialCambiosPerfil = require('../model/nonRelational/HistorialCambiosPerfil');

exports.getAll = async (req, res) => {
  try {
    const cambios = await HistorialCambiosPerfil.find();
    res.json(cambios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevoCambio = new HistorialCambiosPerfil(req.body);
    const resultado = await nuevoCambio.save();
    res.status(201).json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};