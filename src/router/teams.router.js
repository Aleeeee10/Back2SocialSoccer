// src/router/teams.router.js
// Router para el recurso: Equipos (Teams)
const express = require('express');
const router = express.Router();
const controller = require('../controller/teams.controller');

// Listar todos los equipos
router.get('/teams', controller.listar);

// Crear un nuevo equipo
router.post('/teams', controller.crear);

// Actualizar un equipo por ID
router.put('/teams/:id', controller.actualizar);

// Eliminar un equipo por ID
router.delete('/teams/:id', controller.eliminar);

module.exports = router;
