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
  getAllUsersWithPreferences,
  // Nuevas funciones específicas para integración
  getUserPreferences,
  getUserComplete,
  getUserNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  cleanOldNotifications,
  getNotificationStats
} = require('../controller/usersController');

// Rutas básicas para usuarios (SQL)
router.get('/lista', getAllUsers);
router.get('/lista-con-preferencias', getAllUsersWithPreferences);
router.get('/buscar/:id', getUserById);
router.get('/completo/:id', getUserWithPreferences);
router.post('/crear', createUser); // TRIPLE INSERCIÓN: User + Preferences + Notification
router.put('/actualizar/:id', updateUser);
router.delete('/eliminar/:id', deleteUser);

// Rutas heredadas para preferencias de usuario (MongoDB)
router.get('/preferencias/lista', getAllUserPreferences);
router.get('/preferencias/buscar/:id', getUserPreferencesById);
router.get('/preferencias/usuario/:userId', getUserPreferencesByUserId);
router.post('/preferencias/crear', createUserPreferences);
router.put('/preferencias/actualizar/:id', updateUserPreferences);
router.put('/preferencias/actualizar-usuario/:userId', updateUserPreferencesByUserId);
router.delete('/preferencias/eliminar/:id', deleteUserPreferences);

// NUEVAS RUTAS ESPECÍFICAS PARA INTEGRACIÓN COMPLETA

// Rutas para UserPreferences integradas
router.get('/mis-preferencias/:userId', getUserPreferences);
router.get('/perfil-completo/:userId', getUserComplete);
router.put('/mis-preferencias/:userId', updateUserPreferences);

// Rutas para NotificationsLog integradas
router.get('/notificaciones/:userId', getUserNotifications);
router.post('/notificacion/:userId', createNotification);
router.put('/notificacion/:userId/:notificationId/leer', markNotificationAsRead);
router.put('/notificaciones/:userId/leer-todas', markAllNotificationsAsRead);
router.delete('/notificaciones/:userId/limpiar', cleanOldNotifications);
router.get('/notificaciones/:userId/estadisticas', getNotificationStats);

module.exports = router;
