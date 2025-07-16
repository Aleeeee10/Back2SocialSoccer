const mongoose = require('mongoose');

const LogsErroresSchema = new mongoose.Schema({
  mensaje: { type: String, required: true },
  stack: { type: String },
  url: { type: String },
  userId: { type: Number },
  fecha: { type: Date, default: Date.now },
  estado: { type: Boolean, default: true } // Campo para eliminación lógica - consistencia con otros modelos
});

module.exports = mongoose.model('LogsErrores', LogsErroresSchema);
