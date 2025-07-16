// router/matches.js - Rutas para gestión de partidos siguiendo patrón estándar
const express = require('express');
const router = express.Router();
const { getAllMatches, mostrarMatches, createMatch, mandarMatch, getById, update, delete: deleteMatch } = require('../controller/matchesController');

// Rutas principales siguiendo el patrón estándar
router.get('/lista', getAllMatches);           // Lista de partidos (ORM)
router.get('/mostrar', mostrarMatches);        // Mostrar partidos (SQL directo)
router.get('/buscar/:id', getById);           // Buscar partido específico
router.get('/mandar/:id', mandarMatch);       // Mandar/enviar partido
router.post('/crear', createMatch);           // Crear nuevo partido
router.put('/actualizar/:id', update);       // Actualizar partido
router.delete('/eliminar/:id', deleteMatch); // Eliminar partido

// Rutas de compatibilidad (mantener funcionalidad existente)

module.exports = router;
