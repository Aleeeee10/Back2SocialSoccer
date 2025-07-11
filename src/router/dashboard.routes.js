const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboard.controller'); // ✅ carpeta correcta

// Ruta principal del dashboard
router.get('/', dashboardController.resumen);

module.exports = router;
