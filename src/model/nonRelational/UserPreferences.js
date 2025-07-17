const mongoose = require('mongoose');

const UserPreferencesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tema: { type: String, default: 'claro' }, //no poner tupe: string lo mas sencillo posible
  notificaciones: { type: Boolean, default: true },
  idioma: { type: String, default: 'es' }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserPreferences', UserPreferencesSchema);

//userMensajes mejor para saber de que se trata el archivo