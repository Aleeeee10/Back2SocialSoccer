const express = require('express');
const router = express.Router();

const { mandar, listar } = require('../controller/rol.controller');

router.post('/', mandar);
router.get('/listar', listar);

module.exports = router;
