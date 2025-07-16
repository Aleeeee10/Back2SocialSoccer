const express = require('express');
const router = express.Router();
const { 
  getAllActivityLogs, 
  mostrarActivityLogs, 
  createActivityLogs, 
  mandarActivityLogs,
  getById,
  update,
  delete: deleteActivityLogs
} = require('../controller/activityLogsController');

// Rutas principales con nombres descriptivos
router.get('/lista', getAllActivityLogs);
router.get('/mostrar', mostrarActivityLogs);
router.get('/buscar/:id', getById);
router.get('/mandar/:id', mandarActivityLogs);
router.post('/crear', createActivityLogs);
router.put('/actualizar/:id', update);
router.delete('/eliminar/:id', deleteActivityLogs);

// Rutas de compatibilidad (mantener funcionalidad existente)


module.exports = router;
