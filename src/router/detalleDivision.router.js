// src/router/detalleDivision.router.js
// Router para el recurso: Detalle de Divisiones
const express = require('express');
const router = express.Router();
const controller = require('../controller/detalleDivision.controller');

router.get('/detalle-division', controller.listar);
router.post('/detalle-division', controller.crear);
router.put('/detalle-division/:id', controller.actualizar);
router.delete('/detalle-division/:id', controller.eliminar);

module.exports = router;
