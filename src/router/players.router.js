// src/router/players.router.js
// Router para el recurso: Jugadores (Players)
const express = require('express');
const router = express.Router();
const controller = require('../controller/players.controller');

router.get('/', controller.listar);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;
