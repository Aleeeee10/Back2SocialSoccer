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
  deleteTorneo
} = require('../controller/torneosController');

// RUTAS PRINCIPALES PARA TORNEOS (MySQL)
router.get('/lista', getAllTorneos);
router.get('/mostrar', mostrarTorneos);
router.get('/buscar/:id', getTorneoById);
router.post('/crear', createTorneo);
router.post('/mandar', mandarTorneo);
router.put('/actualizar/:id', updateTorneo);
router.delete('/eliminar/:id', deleteTorneo);



module.exports = router;
