const mongoose = require('mongoose');

const NotificationsLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  mensaje: { type: String, required: true },
  tipo: { type: String, default: 'info' }, // info, warning, success, error
  leido: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('NotificationsLog', NotificationsLogSchema);
