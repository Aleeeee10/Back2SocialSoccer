const express = require('express');
const router = express.Router();
const { getAllLogsErrores, mostrarLogsErrores, createLogsErrores, mandarLogsErrores, getById, update, delete: deleteLogsErrores } = require('../controller/logsErroresController');

// Rutas descriptivas para Logs de Errores
router.get('/lista', getAllLogsErrores);           // Lista básica con MongoDB
router.get('/mostrar', mostrarLogsErrores);        // Vista completa con agregación + niveles de error
router.get('/buscar/:id', getById);                // Buscar por ID
router.get('/mandar/:id', mandarLogsErrores);      // Mandar con encriptación
router.post('/crear', createLogsErrores);          // Crear nuevo
router.put('/actualizar/:id', update);             // Actualizar existente
router.delete('/eliminar/:id', deleteLogsErrores); // Eliminar (lógico)

// Rutas de compatibilidad (mantienen funcionalidad anterior)
router.get('/', getAllLogsErrores);
router.get('/:id', getById);
router.post('/', createLogsErrores);
router.put('/:id', update);
router.delete('/:id', deleteLogsErrores);

module.exports = router;