// src/router/detalleResultados.router.js
// Router para el recurso: Detalle de Resultados
const express = require('express');
const router = express.Router();
const controller = require('../controller/detalleResultados.controller');

// Listar todos los detalles de resultados
router.get('/detalle-resultados', controller.listar);

// Crear un nuevo detalle de resultado
router.post('/detalle-resultados', controller.crear);

// Actualizar un detalle de resultado por ID
router.put('/detalle-resultados/:id', controller.actualizar);

// Eliminar un detalle de resultado por ID
router.delete('/detalle-resultados/:id', controller.eliminar);

module.exports = router;
