const EncuestasFeedback = require('../model/nonRelational/EncuestasFeedback');

exports.getAll = async (req, res) => {
  try {
    const feedbacks = await EncuestasFeedback.find();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevo = new EncuestasFeedback(req.body);
    const resultado = await nuevo.save();
    res.status(201).json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};