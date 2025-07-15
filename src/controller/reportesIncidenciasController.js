const ReportesIncidencias = require('../model/nonRelational/ReportesIncidencias');

// Crear un nuevo reporte
exports.crearReporte = async (req, res) => {
  try {
    const nuevoReporte = new ReportesIncidencias(req.body);
    await nuevoReporte.save();
    res.status(201).json(nuevoReporte);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el reporte', detalles: error.message });
  }
};

// Obtener todos los reportes
exports.obtenerReportes = async (req, res) => {
  try {
    const reportes = await ReportesIncidencias.find();
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los reportes' });
  }
};

// Obtener un solo reporte por ID
exports.obtenerReportePorId = async (req, res) => {
  try {
    const reporte = await ReportesIncidencias.findById(req.params.id);
    if (!reporte) return res.status(404).json({ error: 'Reporte no encontrado' });
    res.json(reporte);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el reporte' });
  }
};

// Actualizar un reporte
exports.actualizarReporte = async (req, res) => {
  try {
    const actualizado = await ReportesIncidencias.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!actualizado) return res.status(404).json({ error: 'Reporte no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el reporte' });
  }
};

// Eliminar un reporte
exports.eliminarReporte = async (req, res) => {
  try {
    const eliminado = await ReportesIncidencias.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Reporte no encontrado' });
    res.json({ mensaje: 'Reporte eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el reporte' });
  }
};
