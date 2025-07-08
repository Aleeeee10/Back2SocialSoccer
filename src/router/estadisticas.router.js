// Router para el recurso: Estadísticas
const express = require('express');
const router = express.Router();
const controller = require('../controller/estadisticas.controller');

router.get('/estadisticas', controller.listar);
router.post('/estadisticas', controller.crear);
router.put('/estadisticas/:id', controller.actualizar);
router.delete('/estadisticas/:id', controller.eliminar);

module.exports = router;
