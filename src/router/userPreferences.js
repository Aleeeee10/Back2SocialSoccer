const express = require('express');
const router = express.Router();
const { 
  getAllUserPreferences,
  getUserPreferencesById,
  getUserPreferencesByUserId,
  createUserPreferences,
  updateUserPreferences,
  updateUserPreferencesByUserId,
  deleteUserPreferences
} = require('../controller/usersController');

// Rutas para preferencias de usuario (MongoDB)
router.get('/lista', getAllUserPreferences);
router.get('/buscar/:id', getUserPreferencesById);
router.get('/usuario/:userId', getUserPreferencesByUserId);
router.post('/crear', createUserPreferences);
router.put('/actualizar/:id', updateUserPreferences);
router.put('/actualizar-usuario/:userId', updateUserPreferencesByUserId);
router.delete('/eliminar/:id', deleteUserPreferences);

module.exports = router;
