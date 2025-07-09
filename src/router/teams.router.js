// src/router/teams.router.js
// Router para el recurso: Equipos (Teams)
const express = require('express');
const router = express.Router();
const controller = require('../controller/teams.controller');

// Listar todos los equipos
router.get('/', controller.listar);

// Crear un nuevo equipo
router.post('/', controller.crear);

// Actualizar un equipo por ID
router.put('/:id', controller.actualizar);

// Eliminar un equipo por ID
router.delete('/:id', controller.eliminar);

module.exports = router;
