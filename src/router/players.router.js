// src/router/players.router.js
// Router para el recurso: Jugadores (Players)
const express = require('express');
const router = express.Router();
const controller = require('../controller/players.controller');

router.get('/players', controller.listar);
router.post('/players', controller.crear);
router.put('/players/:id', controller.actualizar);
router.delete('/players/:id', controller.eliminar);

module.exports = router;
