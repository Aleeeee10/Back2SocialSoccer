const express = require('express');
const router = express.Router();
const { 
  getAllEncuestasFeedback, 
  mostrarEncuestasFeedback, 
  createEncuestasFeedback, 
  mandarEncuestasFeedback,
  getById,
  update,
  delete: deleteEncuestasFeedback
} = require('../controller/encuestasFeedbackController');

// Rutas principales con nombres descriptivos
router.get('/lista', getAllEncuestasFeedback);
router.get('/mostrar', mostrarEncuestasFeedback);
router.get('/buscar/:id', getById);
router.get('/mandar/:id', mandarEncuestasFeedback);
router.post('/crear', createEncuestasFeedback);
router.put('/actualizar/:id', update);
router.delete('/eliminar/:id', deleteEncuestasFeedback);

// Rutas de compatibilidad (mantener funcionalidad existente)
router.get('/', getAllEncuestasFeedback);
router.post('/', createEncuestasFeedback);

module.exports = router;