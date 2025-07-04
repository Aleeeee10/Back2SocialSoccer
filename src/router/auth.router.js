// src/router/auth.router.js
const express = require('express');
const router = express.Router();
const { register, login, savePreferences } = require('../controller/auth.controller');

router.post('/register', register);
router.post('/login', login); // <-- Agrega esta línea
// Ruta para guardar preferencias de usuario (tema, fuente, color)
router.post('/preferences', savePreferences);

module.exports = router;
