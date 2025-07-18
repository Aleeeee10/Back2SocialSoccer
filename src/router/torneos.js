// router/torneos.js
const express = require('express');
const router = express.Router();

const { 
  getAllTorneos, 
  mostrarTorneos,
  getTorneoById, 
  createTorneo,
  mandarTorneo,
  updateTorneo, 
  deleteTorneo,
  // Funciones específicas para Tournament Brackets (MongoDB)
  getTournamentBrackets,
  getTournamentWithBrackets,
  setupTournament,
  addRound,
  updateMatchResult,
  updateGroupTable,
  setPrizes,
  generateEliminationBrackets
} = require('../controller/torneosController');

// RUTAS PRINCIPALES PARA TORNEOS (MySQL)
router.get('/lista', getAllTorneos);
router.get('/mostrar', mostrarTorneos);
router.get('/buscar/:id', getTorneoById);
router.post('/crear', createTorneo);
router.post('/mandar', mandarTorneo);
router.put('/actualizar/:id', updateTorneo);
router.delete('/eliminar/:id', deleteTorneo);

// RUTAS ESPECÍFICAS PARA TOURNAMENT BRACKETS (MongoDB)
router.get('/brackets/:torneoId', getTournamentBrackets);
router.get('/completo/:torneoId', getTournamentWithBrackets);
router.put('/configurar/:torneoId', setupTournament);
router.post('/ronda/:torneoId', addRound);
router.put('/resultado/:torneoId/:rondaIndex/:partidoIndex', updateMatchResult);
router.put('/tabla/:torneoId/:grupoIndex', updateGroupTable);
router.put('/premios/:torneoId', setPrizes);
router.post('/generar-brackets/:torneoId', generateEliminationBrackets);

module.exports = router;
