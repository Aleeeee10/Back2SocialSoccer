const { EncuestasFeedbackModel } = require('../dataBase/dataBase.mongo');
const { encrypDates } = require('../lib/helpers');

const encuestasFeedbackCtl = {
  // Obtener todas las encuestas de feedback con agregación MongoDB
  getAllEncuestasFeedback: async (req, res) => {
    try {
      const encuestas = await EncuestasFeedbackModel.aggregate([
        {
          $match: { estado: true }
        },
        {
          $addFields: {
            // Indicador visual basado en la puntuación
            indicadorSatisfaccion: {
              $switch: {
                branches: [
                  { case: { $eq: ["$puntuacion", 5] }, then: "😍 Excelente" },
                  { case: { $eq: ["$puntuacion", 4] }, then: "😊 Muy Bueno" },
                  { case: { $eq: ["$puntuacion", 3] }, then: "😐 Bueno" },
                  { case: { $eq: ["$puntuacion", 2] }, then: "😕 Regular" },
                  { case: { $eq: ["$puntuacion", 1] }, then: "😞 Malo" }
                ],
                default: "❓ Sin Calificar"
              }
            },
            // Estrellas visuales
            estrellasVisuales: {
              $switch: {
                branches: [
                  { case: { $eq: ["$puntuacion", 5] }, then: "⭐⭐⭐⭐⭐" },
                  { case: { $eq: ["$puntuacion", 4] }, then: "⭐⭐⭐⭐☆" },
                  { case: { $eq: ["$puntuacion", 3] }, then: "⭐⭐⭐☆☆" },
                  { case: { $eq: ["$puntuacion", 2] }, then: "⭐⭐☆☆☆" },
                  { case: { $eq: ["$puntuacion", 1] }, then: "⭐☆☆☆☆" }
                ],
                default: "☆☆☆☆☆"
              }
            },
            // Tiempo transcurrido desde la encuesta
            tiempoTranscurrido: {
              $let: {
                vars: {
                  diff: { $subtract: [new Date(), "$fecha"] }
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
            // Resumen del feedback
            resumenFeedback: {
              $concat: [
                "👤 Usuario: ", { $toString: "$userId" },
                " | ", { $ifNull: [{ $substr: ["$comentarios", 0, 50] }, "Sin comentarios"] },
                { $cond: {
                  if: { $gt: [{ $strLenCP: { $ifNull: ["$comentarios", ""] } }, 50] },
                  then: "...",
                  else: ""
                }}
              ]
            }
          }
        },
        {
          $sort: { fecha: -1 }
        }
      ]);

      res.status(200).json({
        ok: true,
        encuestasFeedback: encuestas,
        total: encuestas.length
      });
    } catch (error) {
      console.error('Error en getAllEncuestasFeedback:', error);
      res.status(500).json({
        ok: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // Mostrar encuestas con información detallada
  mostrarEncuestasFeedback: async (req, res) => {
    try {
      const encuestas = await EncuestasFeedbackModel.aggregate([
        {
          $match: { estado: true }
        },
        {
          $addFields: {
            indicadorSatisfaccion: {
              $switch: {
                branches: [
                  { case: { $eq: ["$puntuacion", 5] }, then: "😍 Experiencia Excelente" },
                  { case: { $eq: ["$puntuacion", 4] }, then: "😊 Muy Satisfecho" },
                  { case: { $eq: ["$puntuacion", 3] }, then: "😐 Satisfecho" },
                  { case: { $eq: ["$puntuacion", 2] }, then: "😕 Poco Satisfecho" },
                  { case: { $eq: ["$puntuacion", 1] }, then: "😞 Insatisfecho" }
                ],
                default: "❓ Sin Calificación"
              }
            },
            fechaFormateada: {
              $dateToString: {
                format: "%d/%m/%Y %H:%M:%S",
                date: "$fecha",
                timezone: "America/Ecuador"
              }
            },
            tiempoTranscurrido: {
              $let: {
                vars: {
                  diff: { $subtract: [new Date(), "$fecha"] }
                },
                in: {
                  $cond: {
                    if: { $lt: ["$$diff", 60000] }, // Menos de 1 minuto
                    then: "⚡ Hace menos de 1 min",
                    else: {
                      $cond: {
                        if: { $lt: ["$$diff", 3600000] }, // Menos de 1 hora
                        then: { $concat: ["🕐 Hace ", { $toString: { $floor: { $divide: ["$$diff", 60000] } } }, " min"] },
                        else: {
                          $cond: {
                            if: { $lt: ["$$diff", 86400000] }, // Menos de 1 día
                            then: { $concat: ["🕓 Hace ", { $toString: { $floor: { $divide: ["$$diff", 3600000] } } }, " hrs"] },
                            else: { $concat: ["📅 Hace ", { $toString: { $floor: { $divide: ["$$diff", 86400000] } } }, " días"] }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            estrellasVisuales: {
              $switch: {
                branches: [
                  { case: { $eq: ["$puntuacion", 5] }, then: "⭐⭐⭐⭐⭐ (5/5)" },
                  { case: { $eq: ["$puntuacion", 4] }, then: "⭐⭐⭐⭐☆ (4/5)" },
                  { case: { $eq: ["$puntuacion", 3] }, then: "⭐⭐⭐☆☆ (3/5)" },
                  { case: { $eq: ["$puntuacion", 2] }, then: "⭐⭐☆☆☆ (2/5)" },
                  { case: { $eq: ["$puntuacion", 1] }, then: "⭐☆☆☆☆ (1/5)" }
                ],
                default: "☆☆☆☆☆ (Sin calificar)"
              }
            },
            detalleCompleto: {
              $concat: [
                "👤 Usuario ID: ", { $toString: "$userId" },
                " | 🗨️ Comentario: ", { $ifNull: ["$comentarios", "Sin comentarios proporcionados"] }
              ]
            },
            // Categoría de feedback
            categoriaFeedback: {
              $switch: {
                branches: [
                  { case: { $gte: ["$puntuacion", 4] }, then: "🟢 Feedback Positivo" },
                  { case: { $eq: ["$puntuacion", 3] }, then: "🟡 Feedback Neutral" },
                  { case: { $lte: ["$puntuacion", 2] }, then: "🔴 Feedback Negativo" }
                ],
                default: "⚪ Sin Categorizar"
              }
            }
          }
        },
        {
          $sort: { fecha: -1 }
        }
      ]);

      res.status(200).json({
        ok: true,
        message: 'Encuestas de feedback obtenidas exitosamente',
        data: encuestas,
        total: encuestas.length
      });
    } catch (error) {
      console.error('Error en mostrarEncuestasFeedback:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al obtener las encuestas de feedback'
      });
    }
  },

  // Crear nueva encuesta de feedback
  createEncuestasFeedback: async (req, res) => {
    try {
      const nuevaEncuesta = new EncuestasFeedbackModel({
        ...req.body,
        fecha: new Date(),
        estado: true
      });

      const resultado = await nuevaEncuesta.save();
      
      res.status(201).json({
        ok: true,
        message: 'Encuesta de feedback creada exitosamente',
        encuestaFeedback: resultado
      });
    } catch (error) {
      console.error('Error en createEncuestasFeedback:', error);
      res.status(400).json({
        ok: false,
        error: 'Error al crear la encuesta de feedback'
      });
    }
  },

  // Enviar encuesta con encriptación de fechas
  mandarEncuestasFeedback: async (req, res) => {
    try {
      const { id } = req.params;
      const encuesta = await EncuestasFeedbackModel.findById(id);

      if (!encuesta || !encuesta.estado) {
        return res.status(404).json({
          ok: false,
          error: 'Encuesta de feedback no encontrada'
        });
      }

      // Encriptar fechas sensibles
      const encuestaEncriptada = {
        ...encuesta.toObject(),
        fecha: encrypDates(encuesta.fecha)
      };

      res.status(200).json({
        ok: true,
        encuestaFeedback: encuestaEncriptada
      });
    } catch (error) {
      console.error('Error en mandarEncuestasFeedback:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al obtener la encuesta de feedback'
      });
    }
  },

  // Buscar por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const encuesta = await EncuestasFeedbackModel.findOne({ _id: id, estado: true });

      if (!encuesta) {
        return res.status(404).json({
          ok: false,
          error: 'Encuesta de feedback no encontrada'
        });
      }

      res.status(200).json({
        ok: true,
        encuestaFeedback: encuesta
      });
    } catch (error) {
      console.error('Error en getById:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al buscar la encuesta'
      });
    }
  },

  // Actualizar encuesta
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const encuestaActualizada = await EncuestasFeedbackModel.findByIdAndUpdate(
        id,
        { ...req.body, fechaActualizacion: new Date() },
        { new: true, runValidators: true }
      );

      if (!encuestaActualizada) {
        return res.status(404).json({
          ok: false,
          error: 'Encuesta de feedback no encontrada'
        });
      }

      res.status(200).json({
        ok: true,
        message: 'Encuesta actualizada exitosamente',
        encuestaFeedback: encuestaActualizada
      });
    } catch (error) {
      console.error('Error en update:', error);
      res.status(400).json({
        ok: false,
        error: 'Error al actualizar la encuesta'
      });
    }
  },

  // Eliminar (soft delete)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const encuestaEliminada = await EncuestasFeedbackModel.findByIdAndUpdate(
        id,
        { estado: false, fechaEliminacion: new Date() },
        { new: true }
      );

      if (!encuestaEliminada) {
        return res.status(404).json({
          ok: false,
          error: 'Encuesta de feedback no encontrada'
        });
      }

      res.status(200).json({
        ok: true,
        message: 'Encuesta eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error en delete:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al eliminar la encuesta'
      });
    }
  }
};

module.exports = encuestasFeedbackCtl;