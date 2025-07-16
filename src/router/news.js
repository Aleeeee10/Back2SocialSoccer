// Router para news - Manejo de rutas de noticias del sistema
const express = require('express');
const router = express.Router();
const { getAllNews, mostrarNews, createNews, mandarNews, getById, update, delete: deleteNews } = require('../controller/newsController');

// Rutas principales de noticias
router.get('/lista', getAllNews);           // GET /news/lista - Obtener todas las noticias (ORM)
router.get('/mostrar', mostrarNews);        // GET /news/mostrar - Mostrar noticias (SQL directo)
router.get('/buscar/:id', getById);         // GET /news/buscar/:id - Buscar noticia por ID
router.get('/mandar/:id', mandarNews);      // GET /news/mandar/:id - Mandar noticia específica
router.post('/crear', createNews);          // POST /news/crear - Crear nueva noticia
router.put('/actualizar/:id', update);      // PUT /news/actualizar/:id - Actualizar noticia
router.delete('/eliminar/:id', deleteNews); // DELETE /news/eliminar/:id - Eliminar noticia

// Rutas de compatibilidad (mantener funcionalidad existente)


module.exports = router;
