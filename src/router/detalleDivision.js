const express = require('express');
const router = express.Router();
const detalleDivisionController = require('../controller/detalleDivisionController');

// Rutas básicas para Detalle Division
router.get('/', detalleDivisionController.getAll);
router.get('/:id', detalleDivisionController.getById);
router.post('/', detalleDivisionController.create);
router.put('/:id', detalleDivisionController.update);
router.delete('/:id', detalleDivisionController.delete);

module.exports = router;
