// src/router/detalleEstadisticas.router.js
// Router para el recurso: Detalle de Estadísticas
const express = require('express');
const router = express.Router();
const controller = require('../controller/detalleEstadisticas.controller');

router.get('/detalle-estadisticas', controller.listar);
router.post('/detalle-estadisticas', controller.crear);
router.put('/detalle-estadisticas/:id', controller.actualizar);
router.delete('/detalle-estadisticas/:id', controller.eliminar);

module.exports = router;
