// src/router/detalleJugadores.js
const express = require('express');
const router = express.Router();

// Importamos el controlador (que también vamos a crear)
const detalleJugadoresController = require('../controller/detalleJugadoresController');

// Rutas básicas ejemplo
router.get('/', detalleJugadoresController.getAll);
router.get('/:id', detalleJugadoresController.getById);
router.post('/', detalleJugadoresController.create);
router.put('/:id', detalleJugadoresController.update);
router.delete('/:id', detalleJugadoresController.delete);

module.exports = router;
