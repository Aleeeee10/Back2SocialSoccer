const mongoose = require('mongoose');

const HistorialCambiosPerfilSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  campo: { type: String, required: true },
  valorAnterior: { type: String },
  valorNuevo: { type: String },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HistorialCambiosPerfil', HistorialCambiosPerfilSchema);
