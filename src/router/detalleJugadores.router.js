// src/router/detalleJugadores.router.js
// Router para el recurso: Detalle de Jugadores
const express = require('express');
const router = express.Router();
const controller = require('../controller/detalleJugadores.controller');

router.get('/detalle-jugadores', controller.listar);
router.post('/detalle-jugadores', controller.crear);
router.put('/detalle-jugadores/:id', controller.actualizar);
router.delete('/detalle-jugadores/:id', controller.eliminar);

module.exports = router;
