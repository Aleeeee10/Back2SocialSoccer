const HistorialLogin = require('../model/nonRelational/HistorialLogin');

exports.getAll = async (req, res) => {
  try {
    const logs = await HistorialLogin.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevoLog = new HistorialLogin(req.body);
    const resultado = await nuevoLog.save();
    res.status(201).json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};