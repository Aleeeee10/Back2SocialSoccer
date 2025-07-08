// src/router/division.router.js
// Router para el recurso: Divisiones
const express = require('express');
const router = express.Router();
const controller = require('../controller/division.controller');

router.get('/division', controller.listar);
router.post('/division', controller.crear);
router.put('/division/:id', controller.actualizar);
router.delete('/division/:id', controller.eliminar);

module.exports = router;
