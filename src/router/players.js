// Router para players - Manejo de rutas de jugadores del sistema
const express = require('express');
const router = express.Router();
const { getAllPlayers, mostrarPlayers, createPlayer, mandarPlayer, getById, update, delete: deletePlayer } = require('../controller/playersController');

// Rutas principales de jugadores
router.get('/lista', getAllPlayers);           // GET /players/lista - Obtener todos los jugadores (ORM)
router.get('/mostrar', mostrarPlayers);        // GET /players/mostrar - Mostrar jugadores (SQL directo)
router.get('/buscar/:id', getById);            // GET /players/buscar/:id - Buscar jugador por ID
router.get('/mandar/:id', mandarPlayer);       // GET /players/mandar/:id - Mandar jugador específico
router.post('/crear', createPlayer);           // POST /players/crear - Crear nuevo jugador
router.put('/actualizar/:id', update);         // PUT /players/actualizar/:id - Actualizar jugador
router.delete('/eliminar/:id', deletePlayer); // DELETE /players/eliminar/:id - Eliminar jugador

// Rutas de compatibilidad (mantener funcionalidad existente)


module.exports = router;
