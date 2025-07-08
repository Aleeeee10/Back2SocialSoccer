// src/router/resultados.router.js
// Router para el recurso: Resultados
const express = require('express');
const router = express.Router();
const controller = require('../controller/resultados.controller');

// Listar todos los resultados
router.get('/resultados', controller.listar);

// Crear un nuevo resultado
router.post('/resultados', controller.crear);

// Actualizar un resultado por ID
router.put('/resultados/:id', controller.actualizar);

// Eliminar un resultado por ID
router.delete('/resultados/:id', controller.eliminar);

module.exports = router;
