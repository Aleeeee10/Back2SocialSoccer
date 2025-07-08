// Router para el recurso: Tarjetas (amarillas/rojas)
const express = require('express');
const router = express.Router();
const controller = require('../controller/tarjetas.controller');

// Listar todas las tarjetas
router.get('/tarjetas', controller.listar);

// Crear una nueva tarjeta
router.post('/tarjetas', controller.crear);

// Actualizar una tarjeta por ID
router.put('/tarjetas/:id', controller.actualizar);

// Eliminar una tarjeta por ID
router.delete('/tarjetas/:id', controller.eliminar);

module.exports = router;
