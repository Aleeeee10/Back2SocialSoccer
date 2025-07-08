// Router para el recurso: Noticias (News)
const express = require('express');
const router = express.Router();
const controller = require('../controller/news.controller');

router.get('/news', controller.listar);
router.post('/news', controller.crear);
router.put('/news/:id', controller.actualizar);
router.delete('/news/:id', controller.eliminar);

module.exports = router;
