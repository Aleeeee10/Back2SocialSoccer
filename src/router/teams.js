// router/teams.js
const express = require('express');
const router = express.Router();

const { 
  getAllTeams, 
  mostrarTeams,
  getTeamById, 
  createTeam,
  mandarTeam,
  updateTeam, 
  deleteTeam,
  // Funciones específicas para Team Social (MongoDB)
  getTeamSocial,
  getTeamWithSocial,
  addPost,
  updateSocialMedia,
  updateFollowers,
  likePost,
  updateTeamInfo
} = require('../controller/teamsController');

// RUTAS PRINCIPALES PARA EQUIPOS (MySQL)
router.get('/lista', getAllTeams);
router.get('/mostrar', mostrarTeams);
router.get('/buscar/:id', getTeamById);
router.post('/crear', createTeam);
router.post('/mandar', mandarTeam);
router.put('/actualizar/:id', updateTeam);
router.delete('/eliminar/:id', deleteTeam);

// RUTAS ESPECÍFICAS PARA TEAM SOCIAL (MongoDB)
router.get('/social/:teamId', getTeamSocial);
router.get('/completo/:teamId', getTeamWithSocial);
router.post('/publicacion/:teamId', addPost);
router.put('/redes-sociales/:teamId', updateSocialMedia);
router.put('/seguidores/:teamId', updateFollowers);
router.patch('/like/:teamId/:postId', likePost);
router.put('/informacion/:teamId', updateTeamInfo);

module.exports = router;
