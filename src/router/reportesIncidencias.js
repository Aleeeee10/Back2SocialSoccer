const express = require('express');
const router = express.Router();
const controller = require('../controller/reportesIncidenciasController');

router.post('/', controller.crearReporte);
router.get('/', controller.obtenerReportes);
router.get('/:id', controller.obtenerReportePorId);
router.put('/:id', controller.actualizarReporte);
router.delete('/:id', controller.eliminarReporte);

module.exports = router;
