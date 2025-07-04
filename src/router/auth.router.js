// src/router/auth.router.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/auth.controller');

router.post('/register', register);
router.post('/login', login); // <-- Agrega esta línea

module.exports = router;
