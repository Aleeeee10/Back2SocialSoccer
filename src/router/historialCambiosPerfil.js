const express = require('express');
const router = express.Router();
const ctrl = require('../controller/historialCambiosPerfilController');

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);

module.exports = router;