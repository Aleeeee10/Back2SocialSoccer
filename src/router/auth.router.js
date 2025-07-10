// src/router/auth.router.js
const express = require('express');
const router = express.Router();
const { register, login, savePreferences, getPreferences, getProfile, updateProfile } = require('../controller/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/preferences', savePreferences);
router.get('/preferences', getPreferences);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile', updateProfile); // <-- AGREGA ESTA LÍNEA

module.exports = router;
