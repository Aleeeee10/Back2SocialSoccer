// Router para el recurso: Canchas (Campos de juego)
const express = require('express');
const router = express.Router();
const controller = require('../controller/canchas.controller');

// Listar todas las canchas
router.get('/canchas', controller.listar);

// Crear una nueva cancha
router.post('/canchas', controller.crear);

// Actualizar una cancha por ID
router.put('/canchas/:id', controller.actualizar);

// Eliminar una cancha por ID
router.delete('/canchas/:id', controller.eliminar);

module.exports = router;
