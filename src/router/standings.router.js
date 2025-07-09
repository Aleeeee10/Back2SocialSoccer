// src/router/standings.router.js
// Router para el recurso: Posiciones/Tabla de posiciones
const express = require('express');
const router = express.Router();
const controller = require('../controller/standings.controller');

router.get('/', controller.listar);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;
