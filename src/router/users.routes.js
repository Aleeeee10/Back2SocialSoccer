const express = require('express')
const router = express.Router()
const userController = require('../controller/users.controller') // <- correcto

router.get('/', userController.listar)
router.post('/', userController.crear)
router.put('/:id', userController.actualizar)
router.delete('/:id', userController.eliminar)

module.exports = router
