const mongoose = require('mongoose');

const UserPreferencesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tema: { type: String, default: 'claro' },
  notificaciones: { type: Boolean, default: true },
  idioma: { type: String, default: 'es' }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserPreferences', UserPreferencesSchema);
