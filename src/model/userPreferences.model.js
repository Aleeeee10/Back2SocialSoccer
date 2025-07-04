const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true }, // Relaciona con el idUsers de tu SQL
  email: { type: String, required: true },
  role: { type: String, required: true },
  name: { type: String, required: true },
  theme: { type: String, default: 'Claro' }, // Claro/Oscuro
  font: { type: String, default: 'Arial' },
  mainColor: { type: String, default: '#00ffc1' }
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);