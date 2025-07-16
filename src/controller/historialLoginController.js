const { HistorialLoginModel } = require('../dataBase/dataBase.mongo');
const { encrypDates } = require('../lib/helpers');

const historialLoginCtl = {
  // Obtener todos los historiales de login con agregación MongoDB
  getAllHistorialLogin: async (req, res) => {
    try {
      const historiales = await HistorialLoginModel.aggregate([
        {
          $match: { estado: true }
        },
        {
          $addFields: {
            // Indicador visual basado en el éxito del login
            indicadorEstado: {
              $cond: {
                if: { $eq: ["$exito", true] },
                then: "✅ Exitoso",
                else: "❌ Fallido"
              }
            },
            // Tiempo transcurrido desde el login
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
            // Información del dispositivo y ubicación
            infoDispositivo: {
              $concat: [
                "🖥️ ", { $ifNull: ["$navegador", "No especificado"] },
                " | 🌐 IP: ", { $ifNull: ["$ip", "No registrada"] }
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
        historialLogin: historiales,
        total: historiales.length
      });
    } catch (error) {
      console.error('Error en getAllHistorialLogin:', error);
      res.status(500).json({
        ok: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // Mostrar historiales con información detallada
  mostrarHistorialLogin: async (req, res) => {
    try {
      const historiales = await HistorialLoginModel.aggregate([
        {
          $match: { estado: true }
        },
        {
          $addFields: {
            indicadorEstado: {
              $cond: {
                if: { $eq: ["$exito", true] },
                then: "✅ Login Exitoso",
                else: "❌ Login Fallido"
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
            detalleCompleto: {
              $concat: [
                "👤 Usuario ID: ", { $toString: "$userId" },
                " | 🖥️ ", { $ifNull: ["$navegador", "Navegador no detectado"] },
                " | 🌐 ", { $ifNull: ["$ip", "IP no registrada"] }
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
        message: 'Historial de login obtenido exitosamente',
        data: historiales,
        total: historiales.length
      });
    } catch (error) {
      console.error('Error en mostrarHistorialLogin:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al obtener el historial de login'
      });
    }
  },

  // Crear nuevo registro de historial de login
  createHistorialLogin: async (req, res) => {
    try {
      const nuevoHistorial = new HistorialLoginModel({
        ...req.body,
        fecha: new Date(),
        estado: true
      });

      const resultado = await nuevoHistorial.save();
      
      res.status(201).json({
        ok: true,
        message: 'Registro de login creado exitosamente',
        historialLogin: resultado
      });
    } catch (error) {
      console.error('Error en createHistorialLogin:', error);
      res.status(400).json({
        ok: false,
        error: 'Error al crear el registro de login'
      });
    }
  },

  // Enviar historial con encriptación de fechas
  mandarHistorialLogin: async (req, res) => {
    try {
      const { id } = req.params;
      const historial = await HistorialLoginModel.findById(id);

      if (!historial || !historial.estado) {
        return res.status(404).json({
          ok: false,
          error: 'Registro de historial no encontrado'
        });
      }

      // Encriptar fechas sensibles
      const historialEncriptado = {
        ...historial.toObject(),
        fecha: encrypDates(historial.fecha)
      };

      res.status(200).json({
        ok: true,
        historialLogin: historialEncriptado
      });
    } catch (error) {
      console.error('Error en mandarHistorialLogin:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al obtener el registro de historial'
      });
    }
  },

  // Buscar por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const historial = await HistorialLoginModel.findOne({ _id: id, estado: true });

      if (!historial) {
        return res.status(404).json({
          ok: false,
          error: 'Registro de historial no encontrado'
        });
      }

      res.status(200).json({
        ok: true,
        historialLogin: historial
      });
    } catch (error) {
      console.error('Error en getById:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al buscar el registro'
      });
    }
  },

  // Actualizar historial
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const historialActualizado = await HistorialLoginModel.findByIdAndUpdate(
        id,
        { ...req.body, fechaActualizacion: new Date() },
        { new: true, runValidators: true }
      );

      if (!historialActualizado) {
        return res.status(404).json({
          ok: false,
          error: 'Registro de historial no encontrado'
        });
      }

      res.status(200).json({
        ok: true,
        message: 'Registro actualizado exitosamente',
        historialLogin: historialActualizado
      });
    } catch (error) {
      console.error('Error en update:', error);
      res.status(400).json({
        ok: false,
        error: 'Error al actualizar el registro'
      });
    }
  },

  // Eliminar (soft delete)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const historialEliminado = await HistorialLoginModel.findByIdAndUpdate(
        id,
        { estado: false, fechaEliminacion: new Date() },
        { new: true }
      );

      if (!historialEliminado) {
        return res.status(404).json({
          ok: false,
          error: 'Registro de historial no encontrado'
        });
      }

      res.status(200).json({
        ok: true,
        message: 'Registro eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error en delete:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al eliminar el registro'
      });
    }
  }
};

module.exports = historialLoginCtl;