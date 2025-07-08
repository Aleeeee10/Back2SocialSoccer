// src/router/standings.router.js
// Router para el recurso: Posiciones/Tabla de posiciones
const express = require('express');
const router = express.Router();
const controller = require('../controller/standings.controller');

// Listar todas las posiciones
router.get('/standings', controller.listar);

// Crear una nueva posición
router.post('/standings', controller.crear);

// Actualizar una posición por ID
router.put('/standings/:id', controller.actualizar);

// Eliminar una posición por ID
router.delete('/standings/:id', controller.eliminar);

module.exports = router;
