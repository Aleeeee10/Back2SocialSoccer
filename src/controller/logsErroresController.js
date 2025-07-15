const LogsErrores = require('../model/nonRelational/LogsErrores');

exports.getAll = async (req, res) => {
  try {
    const errores = await LogsErrores.find();
    res.json(errores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevoError = new LogsErrores(req.body);
    const resultado = await nuevoError.save();
    res.status(201).json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};