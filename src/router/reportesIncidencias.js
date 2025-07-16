const express = require('express');
const router = express.Router();
const { getAllReportesIncidencias, mostrarReportesIncidencias, createReportesIncidencias, mandarReportesIncidencias, getById, update, delete: deleteReportesIncidencias } = require('../controller/reportesIncidenciasController');

// Rutas descriptivas para Reportes de Incidencias
router.get('/lista', getAllReportesIncidencias);           // Lista básica con MongoDB
router.get('/mostrar', mostrarReportesIncidencias);        // Vista completa con agregación + prioridades
router.get('/buscar/:id', getById);                        // Buscar por ID
router.get('/mandar/:id', mandarReportesIncidencias);      // Mandar con encriptación
router.post('/crear', createReportesIncidencias);          // Crear nuevo
router.put('/actualizar/:id', update);                     // Actualizar existente
router.delete('/eliminar/:id', deleteReportesIncidencias); // Eliminar (lógico)

// Rutas de compatibilidad (mantienen funcionalidad anterior)

module.exports = router;
