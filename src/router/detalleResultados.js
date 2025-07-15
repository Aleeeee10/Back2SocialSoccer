const express = require('express');
const router = express.Router();
const detalleResultadosController = require('../controller/detalleResultadosController');

// Rutas básicas para Detalle Resultados
router.get('/', detalleResultadosController.getAll);
router.get('/:id', detalleResultadosController.getById);
router.post('/', detalleResultadosController.create);
router.put('/:id', detalleResultadosController.update);
router.delete('/:id', detalleResultadosController.delete);

module.exports = router;
