const NotificationsLog = require('../model/nonRelational/NotificationsLog');
const { encryptDates } = require('../lib/helpers');

const notificationsLogCtl = {
  // Obtener todas las notificaciones usando MongoDB
  getAllNotificationsLog: async (req, res) => {
    try {
      const data = await NotificationsLog.find({ estado: { $ne: false } });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mostrar notificaciones con información completa (MongoDB con agregación)
  mostrarNotificationsLog: async (req, res) => {
    try {
      const data = await NotificationsLog.aggregate([
        { $match: { estado: { $ne: false } } },
        {
          $addFields: {
            tipo_visual: {
              $switch: {
                branches: [
                  { case: { $eq: ["$tipo", "error"] }, then: "🔴 Error" },
                  { case: { $eq: ["$tipo", "warning"] }, then: "🟡 Advertencia" },
                  { case: { $eq: ["$tipo", "success"] }, then: "🟢 Éxito" },
                  { case: { $eq: ["$tipo", "info"] }, then: "🔵 Información" }
                ],
                default: "📋 General"
              }
            },
            estado_lectura: {
              $cond: {
                if: "$leido",
                then: "✅ Leída",
                else: "📬 No leída"
              }
            },
            tiempo_transcurrido: {
              $floor: {
                $divide: [
                  { $subtract: [new Date(), "$createdAt"] },
                  1000 * 60 * 60 * 24
                ]
              }
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ]);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear nueva notificación
  createNotificationsLog: async (req, res) => {
    try {
      const nueva = new NotificationsLog({
        ...req.body,
        estado: true
      });
      await nueva.save();
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Mandar notificación específica con encriptación
  mandarNotificationsLog: async (req, res) => {
    try {
      const noti = await NotificationsLog.findOne({
        _id: req.params.id,
        estado: { $ne: false }
      });
      
      if (!noti) {
        return res.status(404).json({ message: 'Notificación no encontrada' });
      }

      const encryptedNoti = encryptDates(noti.toObject());
      res.json(encryptedNoti);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener notificación por ID
  getById: async (req, res) => {
    try {
      const noti = await NotificationsLog.findOne({
        _id: req.params.id,
        estado: { $ne: false }
      });
      if (!noti) return res.status(404).json({ message: 'Notificación no encontrada' });
      res.json(noti);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar notificación existente
  update: async (req, res) => {
    try {
      const actualizada = await NotificationsLog.findOneAndUpdate(
        { _id: req.params.id, estado: { $ne: false } },
        req.body,
        { new: true }
      );
      if (!actualizada) return res.status(404).json({ message: 'Notificación no encontrada' });
      res.json(actualizada);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar notificación (eliminación lógica)
  delete: async (req, res) => {
    try {
      const eliminada = await NotificationsLog.findOneAndUpdate(
        { _id: req.params.id, estado: { $ne: false } },
        { estado: false },
        { new: true }
      );
      if (!eliminada) return res.status(404).json({ message: 'Notificación no encontrada' });
      res.json({ message: 'Notificación eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = notificationsLogCtl;
