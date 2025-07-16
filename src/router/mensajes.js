const express = require('express');
const router = express.Router();
const { getAllMensajes, mostrarMensajes, createMensajes, mandarMensajes, getById, update, delete: deleteMensajes } = require('../controller/mensajesController');

// Rutas descriptivas para Mensajes
router.get('/lista', getAllMensajes);           // Lista básica con MongoDB
router.get('/mostrar', mostrarMensajes);        // Vista completa con agregación + estados y direcciones
router.get('/buscar/:id', getById);             // Buscar por ID
router.get('/mandar/:id', mandarMensajes);      // Mandar con encriptación
router.post('/crear', createMensajes);          // Crear nuevo
router.put('/actualizar/:id', update);          // Actualizar existente
router.delete('/eliminar/:id', deleteMensajes); // Eliminar (lógico)

// Rutas de compatibilidad (mantienen funcionalidad anterior)

module.exports = router;
