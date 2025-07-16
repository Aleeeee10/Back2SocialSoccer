const LogsErrores = require('../model/nonRelational/LogsErrores');
const { encryptDates } = require('../lib/helpers');

const logsErroresCtl = {
  // Obtener todos los logs de errores usando MongoDB
  getAllLogsErrores: async (req, res) => {
    try {
      const errores = await LogsErrores.find({ estado: { $ne: false } });
      res.json(errores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mostrar logs de errores con información completa (MongoDB con agregación)
  mostrarLogsErrores: async (req, res) => {
    try {
      const errores = await LogsErrores.aggregate([
        { $match: { estado: { $ne: false } } },
        {
          $addFields: {
            nivel_error: {
              $switch: {
                branches: [
                  { case: { $regexMatch: { input: "$mensaje", regex: /critical|fatal/i } }, then: "🔴 Crítico" },
                  { case: { $regexMatch: { input: "$mensaje", regex: /error/i } }, then: "🟠 Error" },
                  { case: { $regexMatch: { input: "$mensaje", regex: /warning|warn/i } }, then: "🟡 Advertencia" },
                  { case: { $regexMatch: { input: "$mensaje", regex: /info|debug/i } }, then: "🔵 Información" }
                ],
                default: "📋 General"
              }
            },
            tiempo_transcurrido: {
              $floor: {
                $divide: [
                  { $subtract: [new Date(), "$fecha"] },
                  1000 * 60 * 60 * 24
                ]
              }
            },
            url_info: {
              $cond: {
                if: { $ne: ["$url", null] },
                then: { $concat: ["🌐 URL: ", "$url"] },
                else: "🌐 URL: No especificada"
              }
            },
            usuario_info: {
              $cond: {
                if: { $ne: ["$userId", null] },
                then: { $concat: ["👤 Usuario ID: ", { $toString: "$userId" }] },
                else: "👤 Usuario: Anónimo"
              }
            }
          }
        },
        { $sort: { fecha: -1 } }
      ]);
      res.json(errores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear nuevo log de error
  createLogsErrores: async (req, res) => {
    try {
      const nuevoError = new LogsErrores({
        ...req.body,
        estado: true,
        fecha: new Date()
      });
      const resultado = await nuevoError.save();
      res.status(201).json(resultado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Mandar log de error específico con encriptación
  mandarLogsErrores: async (req, res) => {
    try {
      const error = await LogsErrores.findOne({
        _id: req.params.id,
        estado: { $ne: false }
      });
      
      if (!error) {
        return res.status(404).json({ message: 'Log de error no encontrado' });
      }

      const encryptedError = encryptDates(error.toObject());
      res.json(encryptedError);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener log de error por ID
  getById: async (req, res) => {
    try {
      const error = await LogsErrores.findOne({
        _id: req.params.id,
        estado: { $ne: false }
      });
      if (!error) return res.status(404).json({ message: 'Log de error no encontrado' });
      res.json(error);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar log de error existente
  update: async (req, res) => {
    try {
      const actualizado = await LogsErrores.findOneAndUpdate(
        { _id: req.params.id, estado: { $ne: false } },
        req.body,
        { new: true }
      );
      if (!actualizado) return res.status(404).json({ message: 'Log de error no encontrado' });
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar log de error (eliminación lógica)
  delete: async (req, res) => {
    try {
      const eliminado = await LogsErrores.findOneAndUpdate(
        { _id: req.params.id, estado: { $ne: false } },
        { estado: false },
        { new: true }
      );
      if (!eliminado) return res.status(404).json({ message: 'Log de error no encontrado' });
      res.json({ message: 'Log de error eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = logsErroresCtl;