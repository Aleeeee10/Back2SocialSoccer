const express = require('express');
const router = express.Router();
const { 
  getAllHistorialCambiosPerfil, 
  mostrarHistorialCambiosPerfil, 
  createHistorialCambiosPerfil, 
  mandarHistorialCambiosPerfil,
  getById,
  update,
  delete: deleteHistorialCambiosPerfil
} = require('../controller/historialCambiosPerfilController');

// Rutas principales con nombres descriptivos
router.get('/lista', getAllHistorialCambiosPerfil);
router.get('/mostrar', mostrarHistorialCambiosPerfil);
router.get('/buscar/:id', getById);
router.get('/mandar/:id', mandarHistorialCambiosPerfil);
router.post('/crear', createHistorialCambiosPerfil);
router.put('/actualizar/:id', update);
router.delete('/eliminar/:id', deleteHistorialCambiosPerfil);

// Rutas de compatibilidad (mantener funcionalidad existente)
router.get('/', getAllHistorialCambiosPerfil);
router.post('/', createHistorialCambiosPerfil);

module.exports = router;