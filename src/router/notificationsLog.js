const express = require('express');
const router = express.Router();
const { getAllNotificationsLog, mostrarNotificationsLog, createNotificationsLog, mandarNotificationsLog, getById, update, delete: deleteNotificationsLog } = require('../controller/notificationsLogController');

// Rutas descriptivas para Notifications Log
router.get('/lista', getAllNotificationsLog);           // Lista básica con MongoDB
router.get('/mostrar', mostrarNotificationsLog);        // Vista completa con agregación + estados visuales
router.get('/buscar/:id', getById);                     // Buscar por ID
router.get('/mandar/:id', mandarNotificationsLog);      // Mandar con encriptación
router.post('/crear', createNotificationsLog);          // Crear nueva
router.put('/actualizar/:id', update);                  // Actualizar existente
router.delete('/eliminar/:id', deleteNotificationsLog); // Eliminar (lógico)

// Rutas de compatibilidad (mantienen funcionalidad anterior)

module.exports = router;
