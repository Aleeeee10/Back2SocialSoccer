// Router para roles - Manejo de rutas de roles del sistema
const express = require('express');
const router = express.Router();
const { getAllRoles, mostrarRoles, createRole, mandarRole, getById, update, delete: deleteRole } = require('../controller/rolesController');

// Rutas principales de roles
router.get('/lista', getAllRoles);           // GET /roles/lista - Obtener todos los roles (ORM)
router.get('/mostrar', mostrarRoles);        // GET /roles/mostrar - Mostrar roles (SQL directo)
router.get('/buscar/:id', getById);          // GET /roles/buscar/:id - Buscar rol por ID
router.get('/mandar/:id', mandarRole);       // GET /roles/mandar/:id - Mandar rol específico
router.post('/crear', createRole);           // POST /roles/crear - Crear nuevo rol
router.put('/actualizar/:id', update);       // PUT /roles/actualizar/:id - Actualizar rol
router.delete('/eliminar/:id', deleteRole);  // DELETE /roles/eliminar/:id - Eliminar rol


module.exports = router;
