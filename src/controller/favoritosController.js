const { FavoritosModel } = require('../dataBase/dataBase.mongo');
const { encrypDates } = require('../lib/helpers');

const favoritosCtl = {
  // Obtener todos los favoritos con agregación MongoDB
  getAllFavoritos: async (req, res) => {
    try {
      const favoritos = await FavoritosModel.aggregate([
        {
          $match: { estado: true }
        },
        {
          $addFields: {
            // Indicador visual basado en el tipo de entidad
            indicadorTipo: {
              $switch: {
                branches: [
                  { case: { $eq: ["$tipoEntidad", "jugador"] }, then: "⚽ Jugador" },
                  { case: { $eq: ["$tipoEntidad", "equipo"] }, then: "👥 Equipo" },
                  { case: { $eq: ["$tipoEntidad", "noticia"] }, then: "📰 Noticia" },
                  { case: { $eq: ["$tipoEntidad", "partido"] }, then: "🏆 Partido" },
                  { case: { $eq: ["$tipoEntidad", "torneo"] }, then: "🏅 Torneo" },
                  { case: { $eq: ["$tipoEntidad", "estadistica"] }, then: "📊 Estadística" },
                  { case: { $eq: ["$tipoEntidad", "division"] }, then: "🏛️ División" }
                ],
                default: "⭐ Favorito"
              }
            },
            // Tiempo transcurrido desde que se agregó a favoritos
            tiempoFavorito: {
              $let: {
                vars: {
                  diff: { $subtract: [new Date(), "$createdAt"] }
                },
                in: {
                  $cond: {
                    if: { $lt: ["$$diff", 3600000] }, // Menos de 1 hora
                    then: { $concat: [{ $toString: { $floor: { $divide: ["$$diff", 60000] } } }, " min"] },
                    else: {
                      $cond: {
                        if: { $lt: ["$$diff", 86400000] }, // Menos de 1 día
                        then: { $concat: [{ $toString: { $floor: { $divide: ["$$diff", 3600000] } } }, " hrs"] },
                        else: { $concat: [{ $toString: { $floor: { $divide: ["$$diff", 86400000] } } }, " días"] }
                      }
                    }
                  }
                }
              }
            },
            // Información completa del favorito
            infoFavorito: {
              $concat: [
                "👤 Usuario: ", { $toString: "$userId" },
                " | 🆔 Entidad: ", { $toString: "$entidadId" },
                " | 📝 Tipo: ", { $ifNull: ["$tipoEntidad", "No especificado"] }
              ]
            }
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ]);

      res.status(200).json({
        ok: true,
        favoritos: favoritos,
        total: favoritos.length
      });
    } catch (error) {
      console.error('Error en getAllFavoritos:', error);
      res.status(500).json({
        ok: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // Mostrar favoritos con información detallada
  mostrarFavoritos: async (req, res) => {
    try {
      const favoritos = await FavoritosModel.aggregate([
        {
          $match: { estado: true }
        },
        {
          $addFields: {
            indicadorTipo: {
              $switch: {
                branches: [
                  { case: { $eq: ["$tipoEntidad", "jugador"] }, then: "⚽ Jugador Favorito" },
                  { case: { $eq: ["$tipoEntidad", "equipo"] }, then: "👥 Equipo Favorito" },
                  { case: { $eq: ["$tipoEntidad", "noticia"] }, then: "📰 Noticia Favorita" },
                  { case: { $eq: ["$tipoEntidad", "partido"] }, then: "🏆 Partido Favorito" },
                  { case: { $eq: ["$tipoEntidad", "torneo"] }, then: "🏅 Torneo Favorito" },
                  { case: { $eq: ["$tipoEntidad", "estadistica"] }, then: "📊 Estadística Favorita" },
                  { case: { $eq: ["$tipoEntidad", "division"] }, then: "🏛️ División Favorita" }
                ],
                default: "⭐ Elemento Favorito"
              }
            },
            fechaFormateada: {
              $dateToString: {
                format: "%d/%m/%Y %H:%M:%S",
                date: "$createdAt",
                timezone: "America/Ecuador"
              }
            },
            tiempoFavorito: {
              $let: {
                vars: {
                  diff: { $subtract: [new Date(), "$createdAt"] }
                },
                in: {
                  $cond: {
                    if: { $lt: ["$$diff", 60000] }, // Menos de 1 minuto
                    then: "⚡ Agregado hace menos de 1 min",
                    else: {
                      $cond: {
                        if: { $lt: ["$$diff", 3600000] }, // Menos de 1 hora
                        then: { $concat: ["🕐 Agregado hace ", { $toString: { $floor: { $divide: ["$$diff", 60000] } } }, " min"] },
                        else: {
                          $cond: {
                            if: { $lt: ["$$diff", 86400000] }, // Menos de 1 día
                            then: { $concat: ["🕓 Agregado hace ", { $toString: { $floor: { $divide: ["$$diff", 3600000] } } }, " hrs"] },
                            else: { $concat: ["📅 Agregado hace ", { $toString: { $floor: { $divide: ["$$diff", 86400000] } } }, " días"] }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            detalleCompleto: {
              $concat: [
                "👤 Usuario ID: ", { $toString: "$userId" },
                " | 📝 Tipo: ", { $ifNull: ["$tipoEntidad", "No especificado"] },
                " | 🆔 Entidad ID: ", { $toString: "$entidadId" }
              ]
            },
            // Categoría de popularidad
            categoriaPopularidad: {
              $switch: {
                branches: [
                  { case: { $in: ["$tipoEntidad", ["equipo", "jugador"]] }, then: "🔥 Deportivo" },
                  { case: { $in: ["$tipoEntidad", ["noticia", "estadistica"]] }, then: "📈 Informativo" },
                  { case: { $in: ["$tipoEntidad", ["torneo", "partido"]] }, then: "🏆 Competitivo" },
                  { case: { $eq: ["$tipoEntidad", "division"] }, then: "🏛️ Organizacional" }
                ],
                default: "⭐ General"
              }
            }
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ]);

      res.status(200).json({
        ok: true,
        message: 'Favoritos obtenidos exitosamente',
        data: favoritos,
        total: favoritos.length
      });
    } catch (error) {
      console.error('Error en mostrarFavoritos:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al obtener los favoritos'
      });
    }
  },

  // Crear nuevo favorito
  createFavoritos: async (req, res) => {
    try {
      const nuevoFavorito = new FavoritosModel({
        ...req.body,
        estado: true
      });

      const resultado = await nuevoFavorito.save();
      
      res.status(201).json({
        ok: true,
        message: 'Favorito agregado exitosamente',
        favorito: resultado
      });
    } catch (error) {
      console.error('Error en createFavoritos:', error);
      res.status(400).json({
        ok: false,
        error: 'Error al agregar a favoritos'
      });
    }
  },

  // Enviar favorito con encriptación de fechas
  mandarFavoritos: async (req, res) => {
    try {
      const { id } = req.params;
      const favorito = await FavoritosModel.findById(id);

      if (!favorito || !favorito.estado) {
        return res.status(404).json({
          ok: false,
          error: 'Favorito no encontrado'
        });
      }

      // Encriptar fechas sensibles
      const favoritoEncriptado = {
        ...favorito.toObject(),
        createdAt: encrypDates(favorito.createdAt),
        updatedAt: encrypDates(favorito.updatedAt)
      };

      res.status(200).json({
        ok: true,
        favorito: favoritoEncriptado
      });
    } catch (error) {
      console.error('Error en mandarFavoritos:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al obtener el favorito'
      });
    }
  },

  // Buscar por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const favorito = await FavoritosModel.findOne({ _id: id, estado: true });

      if (!favorito) {
        return res.status(404).json({
          ok: false,
          error: 'Favorito no encontrado'
        });
      }

      res.status(200).json({
        ok: true,
        favorito: favorito
      });
    } catch (error) {
      console.error('Error en getById:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al buscar el favorito'
      });
    }
  },

  // Actualizar favorito
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const favoritoActualizado = await FavoritosModel.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true, runValidators: true }
      );

      if (!favoritoActualizado) {
        return res.status(404).json({
          ok: false,
          error: 'Favorito no encontrado'
        });
      }

      res.status(200).json({
        ok: true,
        message: 'Favorito actualizado exitosamente',
        favorito: favoritoActualizado
      });
    } catch (error) {
      console.error('Error en update:', error);
      res.status(400).json({
        ok: false,
        error: 'Error al actualizar el favorito'
      });
    }
  },

  // Eliminar (soft delete)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const favoritoEliminado = await FavoritosModel.findByIdAndUpdate(
        id,
        { estado: false, fechaEliminacion: new Date() },
        { new: true }
      );

      if (!favoritoEliminado) {
        return res.status(404).json({
          ok: false,
          error: 'Favorito no encontrado'
        });
      }

      res.status(200).json({
        ok: true,
        message: 'Favorito eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error en delete:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al eliminar el favorito'
      });
    }
  }
};

module.exports = favoritosCtl;
