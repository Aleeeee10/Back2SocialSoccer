const orm = require('../dataBase/dataBase.orm')
const bcrypt = require('bcryptjs')

const userController = {}

userController.listar = async (req, res) => {
  try {
    const usuarios = await orm.users.findAll({
      include: [{ model: orm.roles, as: 'rol' }]
    })
    res.json(usuarios)
  } catch (error) {
    console.error('Error al listar usuarios:', error)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}

userController.crear = async (req, res) => {
  try {
    const { username, email, password, roleId } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const nuevo = await orm.users.create({
      nameUser: username,
      emailUser: email,
      passwordUser: hashedPassword,
      idRol: roleId
    })

    res.status(201).json(nuevo)
  } catch (error) {
    console.error('Error al crear usuario:', error)
    res.status(500).json({ error: 'Error al crear usuario' })
  }
}

userController.actualizar = async (req, res) => {
  try {
    const { id } = req.params
    const { username, email, password, roleId } = req.body

    const datos = {
      nameUser: username,
      emailUser: email,
      idRol: roleId
    }

    if (password) {
      datos.passwordUser = await bcrypt.hash(password, 10)
    }

    await orm.users.update(datos, { where: { id } })

    res.json({ mensaje: 'Usuario actualizado' })
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    res.status(500).json({ error: 'Error al actualizar usuario' })
  }
}

userController.eliminar = async (req, res) => {
  try {
    const { id } = req.params
    await orm.users.destroy({ where: { id } })
    res.json({ mensaje: 'Usuario eliminado' })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    res.status(500).json({ error: 'Error al eliminar usuario' })
  }
}

module.exports = userController
