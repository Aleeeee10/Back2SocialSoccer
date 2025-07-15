const mongoose = require('mongoose');

const EncuestasFeedbackSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  puntuacion: { type: Number, min: 1, max: 5 },
  comentarios: { type: String },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EncuestasFeedback', EncuestasFeedbackSchema);
