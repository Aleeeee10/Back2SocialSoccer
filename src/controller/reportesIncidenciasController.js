const ReportesIncidencias = require('../model/nonRelational/ReportesIncidencias');
const { encryptDates } = require('../lib/helpers');

const reportesIncidenciasCtl = {
  // Obtener todos los reportes usando MongoDB
  getAllReportesIncidencias: async (req, res) => {
    try {
      const reportes = await ReportesIncidencias.find({ estado: { $ne: false } });
      res.json(reportes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mostrar reportes con información completa (MongoDB con agregación)
  mostrarReportesIncidencias: async (req, res) => {
    try {
      const reportes = await ReportesIncidencias.aggregate([
        { $match: { estado: { $ne: false } } },
        {
          $addFields: {
            estado_temporal: {
              $switch: {
                branches: [
                  { case: { $eq: ["$tipo", "critico"] }, then: "🔴 Crítico" },
                  { case: { $eq: ["$tipo", "alto"] }, then: "🟠 Alto" },
                  { case: { $eq: ["$tipo", "medio"] }, then: "🟡 Medio" },
                  { case: { $eq: ["$tipo", "bajo"] }, then: "🟢 Bajo" }
                ],
                default: "📋 General"
              }
            },
            dias_transcurridos: {
              $floor: {
                $divide: [
                  { $subtract: [new Date(), "$fecha"] },
                  1000 * 60 * 60 * 24
                ]
              }
            }
          }
        },
        { $sort: { fecha: -1 } }
      ]);
      res.json(reportes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear nuevo reporte
  createReportesIncidencias: async (req, res) => {
    try {
      const nuevoReporte = new ReportesIncidencias({
        ...req.body,
        estado: true,
        fecha: new Date()
      });
      await nuevoReporte.save();
      res.status(201).json(nuevoReporte);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mandar reporte específico con encriptación
  mandarReportesIncidencias: async (req, res) => {
    try {
      const reporte = await ReportesIncidencias.findOne({
        _id: req.params.id,
        estado: { $ne: false }
      });
      
      if (!reporte) {
        return res.status(404).json({ message: 'Reporte de incidencia no encontrado' });
      }

      const encryptedReporte = encryptDates(reporte.toObject());
      res.json(encryptedReporte);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener reporte por ID
  getById: async (req, res) => {
    try {
      const reporte = await ReportesIncidencias.findOne({
        _id: req.params.id,
        estado: { $ne: false }
      });
      if (!reporte) return res.status(404).json({ message: 'Reporte no encontrado' });
      res.json(reporte);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar reporte existente
  update: async (req, res) => {
    try {
      const actualizado = await ReportesIncidencias.findOneAndUpdate(
        { _id: req.params.id, estado: { $ne: false } },
        req.body,
        { new: true }
      );
      if (!actualizado) return res.status(404).json({ message: 'Reporte no encontrado' });
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar reporte (eliminación lógica)
  delete: async (req, res) => {
    try {
      const eliminado = await ReportesIncidencias.findOneAndUpdate(
        { _id: req.params.id, estado: { $ne: false } },
        { estado: false },
        { new: true }
      );
      if (!eliminado) return res.status(404).json({ message: 'Reporte no encontrado' });
      res.json({ message: 'Reporte eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = reportesIncidenciasCtl;
