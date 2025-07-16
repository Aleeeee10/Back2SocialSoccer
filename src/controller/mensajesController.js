const Mensajes = require('../model/nonRelational/mensajes');
const { encryptDates } = require('../lib/helpers');

const mensajesCtl = {
  // Obtener todos los mensajes usando MongoDB
  getAllMensajes: async (req, res) => {
    try {
      const data = await Mensajes.find({ estado: { $ne: false } });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mostrar mensajes con información completa (MongoDB con agregación)
  mostrarMensajes: async (req, res) => {
    try {
      const data = await Mensajes.aggregate([
        { $match: { estado: { $ne: false } } },
        {
          $addFields: {
            estado_lectura: {
              $cond: {
                if: "$leido",
                then: "✅ Leído",
                else: "📬 No leído"
              }
            },
            tiempo_transcurrido: {
              $floor: {
                $divide: [
                  { $subtract: [new Date(), "$createdAt"] },
                  1000 * 60 * 60 * 24
                ]
              }
            },
            direccion_mensaje: {
              $concat: ["📤 De: ", "$de", " 📥 Para: ", "$para"]
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

  // Crear nuevo mensaje
  createMensajes: async (req, res) => {
    try {
      const nuevo = new Mensajes({
        ...req.body,
        estado: true
      });
      await nuevo.save();
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Mandar mensaje específico con encriptación
  mandarMensajes: async (req, res) => {
    try {
      const msg = await Mensajes.findOne({
        _id: req.params.id,
        estado: { $ne: false }
      });
      
      if (!msg) {
        return res.status(404).json({ message: 'Mensaje no encontrado' });
      }

      const encryptedMsg = encryptDates(msg.toObject());
      res.json(encryptedMsg);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener mensaje por ID
  getById: async (req, res) => {
    try {
      const msg = await Mensajes.findOne({
        _id: req.params.id,
        estado: { $ne: false }
      });
      if (!msg) return res.status(404).json({ message: 'Mensaje no encontrado' });
      res.json(msg);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar mensaje existente
  update: async (req, res) => {
    try {
      const actualizado = await Mensajes.findOneAndUpdate(
        { _id: req.params.id, estado: { $ne: false } },
        req.body,
        { new: true }
      );
      if (!actualizado) return res.status(404).json({ message: 'Mensaje no encontrado' });
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar mensaje (eliminación lógica)
  delete: async (req, res) => {
    try {
      const eliminado = await Mensajes.findOneAndUpdate(
        { _id: req.params.id, estado: { $ne: false } },
        { estado: false },
        { new: true }
      );
      if (!eliminado) return res.status(404).json({ message: 'Mensaje no encontrado' });
      res.json({ message: 'Mensaje eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = mensajesCtl;
