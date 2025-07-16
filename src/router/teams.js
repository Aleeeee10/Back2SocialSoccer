// router/teams.js
const express = require('express');
const router = express.Router();

const { 
  getAllTeams, 
  mostrarTeams,
  getTeamById, 
  createTeam,
  mandarTeam,
  updateTeam, 
  deleteTeam
} = require('../controller/teamsController');

// RUTAS PRINCIPALES PARA EQUIPOS (MySQL)
router.get('/lista', getAllTeams);
router.get('/mostrar', mostrarTeams);
router.get('/buscar/:id', getTeamById);
router.post('/crear', createTeam);
router.post('/mandar', mandarTeam);
router.put('/actualizar/:id', updateTeam);
router.delete('/eliminar/:id', deleteTeam);

module.exports = router;
