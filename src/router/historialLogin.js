const express = require('express');
const router = express.Router();
const { 
  getAllHistorialLogin, 
  mostrarHistorialLogin, 
  createHistorialLogin, 
  mandarHistorialLogin,
  getById,
  update,
  delete: deleteHistorialLogin
} = require('../controller/historialLoginController');

// Rutas principales con nombres descriptivos
router.get('/lista', getAllHistorialLogin);
router.get('/mostrar', mostrarHistorialLogin);
router.get('/buscar/:id', getById);
router.get('/mandar/:id', mandarHistorialLogin);
router.post('/crear', createHistorialLogin);
router.put('/actualizar/:id', update);
router.delete('/eliminar/:id', deleteHistorialLogin);

// Rutas de compatibilidad (mantener funcionalidad existente)
router.get('/', getAllHistorialLogin);
router.post('/', createHistorialLogin);

module.exports = router;