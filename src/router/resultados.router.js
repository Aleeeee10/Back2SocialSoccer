const express = require('express');
const router = express.Router();
const controller = require('../controller/resultados.controller');

// Listar todos los resultados
router.get('/', controller.listar);

// Crear un nuevo resultado
router.post('/', controller.crear);

// Actualizar un resultado por ID
router.put('/:id', controller.actualizar);

// Eliminar un resultado por ID
router.delete('/:id', controller.eliminar);

module.exports = router;
