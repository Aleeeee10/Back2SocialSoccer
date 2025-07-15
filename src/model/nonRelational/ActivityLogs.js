const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  accion: { type: String, required: true }, // ejemplo: 'Inicio de sesión', 'Actualizó perfil', etc.
  ip: { type: String },
  navegador: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
