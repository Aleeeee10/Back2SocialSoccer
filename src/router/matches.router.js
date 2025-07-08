// src/router/matches.router.js
// Router para el recurso: Partidos (Matches)
const express = require('express');
const router = express.Router();
const controller = require('../controller/matches.controller');

router.get('/matches', controller.listar);
router.post('/matches', controller.crear);
router.put('/matches/:id', controller.actualizar);
router.delete('/matches/:id', controller.eliminar);

module.exports = router;
