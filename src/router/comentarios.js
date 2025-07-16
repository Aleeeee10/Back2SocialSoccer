const express = require('express');
const router = express.Router();
const { getAllComentarios, mostrarComentarios, createComentario, mandarComentario, getById, update, delete: deleteComentario } = require('../controller/comentariosController');

// Rutas descriptivas para Comentarios
router.get('/lista', getAllComentarios);           // Lista básica con ORM
router.get('/mostrar', mostrarComentarios);        // Vista completa con SQL + JOIN
router.get('/buscar/:id', getById);                // Buscar por ID
router.get('/mandar/:id', mandarComentario);       // Mandar con encriptación
router.post('/crear', createComentario);           // Crear nuevo
router.put('/actualizar/:id', update);             // Actualizar existente
router.delete('/eliminar/:id', deleteComentario); // Eliminar (lógico)

// Rutas de compatibilidad (mantienen funcionalidad anterior)

module.exports = router;
