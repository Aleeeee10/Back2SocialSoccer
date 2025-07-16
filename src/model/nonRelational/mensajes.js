const mongoose = require('mongoose');

const MensajeSchema = new mongoose.Schema({
  de: { type: String, required: true },
  para: { type: String, required: true },
  mensaje: { type: String, required: true },
  leido: { type: Boolean, default: false },
  estado: { type: Boolean, default: true } // Campo para eliminación lógica - consistencia con otros modelos
}, {
  timestamps: true
});

module.exports = mongoose.model('Mensaje', MensajeSchema);
