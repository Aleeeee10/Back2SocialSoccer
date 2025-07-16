const { HistorialCambiosPerfilModel } = require('../dataBase/dataBase.mongo');
const { encrypDates } = require('../lib/helpers');

const historialCambiosPerfilCtl = {
  // Obtener todos los cambios de perfil con agregación MongoDB
  getAllHistorialCambiosPerfil: async (req, res) => {
    try {
      const cambios = await HistorialCambiosPerfilModel.aggregate([
        {
          $match: { estado: true }
        },
        {
          $addFields: {
            // Indicador visual basado en el tipo de cambio
            indicadorCambio: {
              $switch: {
                branches: [
                  { case: { $eq: ["$campo", "email"] }, then: "📧 Email" },
                  { case: { $eq: ["$campo", "password"] }, then: "🔐 Contraseña" },
                  { case: { $eq: ["$campo", "nombre"] }, then: "👤 Nombre" },
                  { case: { $eq: ["$campo", "telefono"] }, then: "📱 Teléfono" },
                  { case: { $eq: ["$campo", "avatar"] }, then: "🖼️ Avatar" },
                  { case: { $eq: ["$campo", "bio"] }, then: "📝 Biografía" },
                  { case: { $eq: ["$campo", "configuracion"] }, then: "⚙️ Configuración" }
                ],
                default: "📊 Otro Campo"
              }
            },
            // Tiempo transcurrido desde el cambio
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
            // Resumen del cambio
            resumenCambio: {
              $concat: [
                "👤 Usuario: ", { $toString: "$userId" },
                " | 🔄 ", { $ifNull: ["$valorAnterior", "Sin valor"] },
                " → ", { $ifNull: ["$valorNuevo", "Sin valor"] }
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
        historialCambiosPerfil: cambios,
        total: cambios.length
      });
    } catch (error) {
      console.error('Error en getAllHistorialCambiosPerfil:', error);
      res.status(500).json({
        ok: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // Mostrar cambios con información detallada
  mostrarHistorialCambiosPerfil: async (req, res) => {
    try {
      const cambios = await HistorialCambiosPerfilModel.aggregate([
        {
          $match: { estado: true }
        },
        {
          $addFields: {
            indicadorCambio: {
              $switch: {
                branches: [
                  { case: { $eq: ["$campo", "email"] }, then: "📧 Cambio de Email" },
                  { case: { $eq: ["$campo", "password"] }, then: "🔐 Cambio de Contraseña" },
                  { case: { $eq: ["$campo", "nombre"] }, then: "👤 Cambio de Nombre" },
                  { case: { $eq: ["$campo", "telefono"] }, then: "📱 Cambio de Teléfono" },
                  { case: { $eq: ["$campo", "avatar"] }, then: "🖼️ Cambio de Avatar" },
                  { case: { $eq: ["$campo", "bio"] }, then: "📝 Cambio de Biografía" },
                  { case: { $eq: ["$campo", "configuracion"] }, then: "⚙️ Cambio de Configuración" }
                ],
                default: "📊 Modificación de Campo"
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
                " | 📝 Campo: ", { $ifNull: ["$campo", "No especificado"] },
                " | 🔄 Cambió de '", { $ifNull: ["$valorAnterior", "Sin valor"] },
                "' a '", { $ifNull: ["$valorNuevo", "Sin valor"] }, "'"
              ]
            },
            // Nivel de importancia del cambio
            nivelImportancia: {
              $switch: {
                branches: [
                  { case: { $in: ["$campo", ["password", "email"]] }, then: "🔴 Alta Seguridad" },
                  { case: { $in: ["$campo", ["telefono", "nombre"]] }, then: "🟡 Información Personal" },
                  { case: { $in: ["$campo", ["avatar", "bio"]] }, then: "🟢 Perfil Visual" },
                  { case: { $eq: ["$campo", "configuracion"] }, then: "🔵 Configuración" }
                ],
                default: "⚪ Información General"
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
        message: 'Historial de cambios de perfil obtenido exitosamente',
        data: cambios,
        total: cambios.length
      });
    } catch (error) {
      console.error('Error en mostrarHistorialCambiosPerfil:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al obtener el historial de cambios'
      });
    }
  },

  // Crear nuevo cambio de perfil
  createHistorialCambiosPerfil: async (req, res) => {
    try {
      const nuevoCambio = new HistorialCambiosPerfilModel({
        ...req.body,
        fecha: new Date(),
        estado: true
      });

      const resultado = await nuevoCambio.save();
      
      res.status(201).json({
        ok: true,
        message: 'Cambio de perfil registrado exitosamente',
        historialCambiosPerfil: resultado
      });
    } catch (error) {
      console.error('Error en createHistorialCambiosPerfil:', error);
      res.status(400).json({
        ok: false,
        error: 'Error al registrar el cambio de perfil'
      });
    }
  },

  // Enviar cambio con encriptación de fechas
  mandarHistorialCambiosPerfil: async (req, res) => {
    try {
      const { id } = req.params;
      const cambio = await HistorialCambiosPerfilModel.findById(id);

      if (!cambio || !cambio.estado) {
        return res.status(404).json({
          ok: false,
          error: 'Cambio de perfil no encontrado'
        });
      }

      // Encriptar fechas sensibles
      const cambioEncriptado = {
        ...cambio.toObject(),
        fecha: encrypDates(cambio.fecha)
      };

      res.status(200).json({
        ok: true,
        historialCambiosPerfil: cambioEncriptado
      });
    } catch (error) {
      console.error('Error en mandarHistorialCambiosPerfil:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al obtener el cambio de perfil'
      });
    }
  },

  // Buscar por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const cambio = await HistorialCambiosPerfilModel.findOne({ _id: id, estado: true });

      if (!cambio) {
        return res.status(404).json({
          ok: false,
          error: 'Cambio de perfil no encontrado'
        });
      }

      res.status(200).json({
        ok: true,
        historialCambiosPerfil: cambio
      });
    } catch (error) {
      console.error('Error en getById:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al buscar el cambio'
      });
    }
  },

  // Actualizar cambio
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const cambioActualizado = await HistorialCambiosPerfilModel.findByIdAndUpdate(
        id,
        { ...req.body, fechaActualizacion: new Date() },
        { new: true, runValidators: true }
      );

      if (!cambioActualizado) {
        return res.status(404).json({
          ok: false,
          error: 'Cambio de perfil no encontrado'
        });
      }

      res.status(200).json({
        ok: true,
        message: 'Cambio actualizado exitosamente',
        historialCambiosPerfil: cambioActualizado
      });
    } catch (error) {
      console.error('Error en update:', error);
      res.status(400).json({
        ok: false,
        error: 'Error al actualizar el cambio'
      });
    }
  },

  // Eliminar (soft delete)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const cambioEliminado = await HistorialCambiosPerfilModel.findByIdAndUpdate(
        id,
        { estado: false, fechaEliminacion: new Date() },
        { new: true }
      );

      if (!cambioEliminado) {
        return res.status(404).json({
          ok: false,
          error: 'Cambio de perfil no encontrado'
        });
      }

      res.status(200).json({
        ok: true,
        message: 'Cambio eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error en delete:', error);
      res.status(500).json({
        ok: false,
        error: 'Error al eliminar el cambio'
      });
    }
  }
};

module.exports = historialCambiosPerfilCtl;