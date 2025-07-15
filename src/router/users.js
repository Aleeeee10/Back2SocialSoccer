const express = require("express");
const router = express.Router();

const { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  getAllUserPreferences,
  getUserPreferencesById,
  getUserPreferencesByUserId,
  createUserPreferences,
  updateUserPreferences,
  updateUserPreferencesByUserId,
  deleteUserPreferences,
  getUserWithPreferences,
  getAllUsersWithPreferences
} = require('../controller/usersController');

// Rutas para usuarios (MySQL)
router.get('/lista', getAllUsers);
router.get('/lista-con-preferencias', getAllUsersWithPreferences);
router.get('/buscar/:id', getUserById);
router.get('/completo/:id', getUserWithPreferences);
router.post('/crear', createUser);
router.put('/actualizar/:id', updateUser);
router.delete('/eliminar/:id', deleteUser);

// Rutas para preferencias de usuario (MongoDB)
router.get('/preferencias/lista', getAllUserPreferences);
router.get('/preferencias/buscar/:id', getUserPreferencesById);
router.get('/preferencias/usuario/:userId', getUserPreferencesByUserId);
router.post('/preferencias/crear', createUserPreferences);
router.put('/preferencias/actualizar/:id', updateUserPreferences);
router.put('/preferencias/actualizar-usuario/:userId', updateUserPreferencesByUserId);
router.delete('/preferencias/eliminar/:id', deleteUserPreferences);

module.exports = router;
