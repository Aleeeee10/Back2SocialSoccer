const mongoose = require('mongoose');

const HistorialLoginSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  ip: { type: String },
  navegador: { type: String },
  fecha: { type: Date, default: Date.now },
  exito: { type: Boolean, default: true },
  estado: { type: Boolean, default: true } // Campo agregado para consistencia con otros modelos
});

module.exports = mongoose.model('HistorialLogin', HistorialLoginSchema);
