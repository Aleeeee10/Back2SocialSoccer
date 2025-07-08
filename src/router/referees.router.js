// src/router/referees.router.js
// Router para el recurso: Árbitros (Referees)
const express = require('express');
const router = express.Router();
const controller = require('../controller/referees.controller');

router.get('/referees', controller.listar);
router.post('/referees', controller.crear);
router.put('/referees/:id', controller.actualizar);
router.delete('/referees/:id', controller.eliminar);

module.exports = router;
