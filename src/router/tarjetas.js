// router/tarjetas.js
const express = require('express');
const router = express.Router();

const { 
  getAllTarjetas, 
  mostrarTarjetas,
  getTarjetaById, 
  createTarjeta,
  mandarTarjeta,
  updateTarjeta, 
  deleteTarjeta
} = require('../controller/tarjetasController');

// RUTAS PRINCIPALES PARA TARJETAS (MySQL)
router.get('/lista', getAllTarjetas);
router.get('/mostrar', mostrarTarjetas);
router.get('/buscar/:id', getTarjetaById);
router.post('/crear', createTarjeta);
router.post('/mandar', mandarTarjeta);
router.put('/actualizar/:id', updateTarjeta);
router.delete('/eliminar/:id', deleteTarjeta);

module.exports = router;
