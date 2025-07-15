const mongoose = require('mongoose');

const ReportesIncidenciasSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  usuarioId: { type: Number, required: true },
  referenciaTipo: { type: String },
  referenciaId: { type: Number }
});

module.exports = mongoose.model('ReportesIncidencias', ReportesIncidenciasSchema);