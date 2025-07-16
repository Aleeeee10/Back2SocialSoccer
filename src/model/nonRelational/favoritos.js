const mongoose = require('mongoose');

const FavoritoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tipoEntidad: { type: String, required: true }, // ejemplo: 'jugador', 'equipo', 'noticia'
  entidadId: { type: String, required: true },
  estado: { type: Boolean, default: true } // Campo agregado para consistencia con otros modelos
}, {
  timestamps: true
});

module.exports = mongoose.model('Favorito', FavoritoSchema);
