// controller/usersController.js
const usersCtl = {};
const orm = require('../dataBase/dataBase.orm');
const sql = require('../dataBase/dataBase.sql');
const mongo = require('../dataBase/dataBase.mongo');
const UserPreferences = require('../model/nonRelational/UserPreferences');
const { cifrarDatos, descifrarDatos } = require('../lib/encrypDates')

function safeDecrypt(data) {
    try {
        return descifrarDatos(data);
    } catch (error) {
        console.error('Error al descifrar datos:', error.message);
        return ''; // Devolver una cadena vacía si ocurre un error
    }
}

// FUNCIONES PARA USUARIOS (MySQL)
usersCtl.getAllUsers = async (req, res) => {
  try {
    const data = await orm.users.findAll();
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: e.message });
  }
};

// FUNCIÓN PARA MOSTRAR USUARIOS CON SQL DIRECTO
usersCtl.mostrarUsers = async (req, res) => {
  try {
    const [listaUsers] = await sql.promise().query('SELECT * FROM users');
    const usuario = await UserPreferences.findOne({ userId: listaUsers[0]?.id?.toString() });
    const usuarios = listaUsers[0];
    const data = {
      usuarios,
      usuario
    };
    return data;
  } catch (error) {
    console.error('Error al mostrar usuarios:', error.message);
    return { error: 'Error al obtener datos' };
  }
};

usersCtl.getUserById = async (req, res) => {
  try {
    const user = await orm.users.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'Error al buscar usuario', error: e.message });
  }
};

usersCtl.createUser = async (req, res) => {
  try {
    const { nombre, email, contraseña, avatar } = req.body;
    
    const userData = {
      nombre,
      email,
      contraseña,
      avatar,
      estado: true
    };
    
    const newUser = await orm.users.create(userData);
    
    // Crear preferencias por defecto para el nuevo usuario
    const defaultPreferences = {
      userId: newUser.id.toString(),
      tema: 'claro',
      notificaciones: true,
      idioma: 'es'
    };
    
    await UserPreferences.create(defaultPreferences);
    
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: newUser
    });
  } catch (e) {
    res.status(400).json({ message: 'Error al crear usuario', error: e.message });
  }
};

// FUNCIÓN PARA CREAR USUARIO CON SQL Y MONGO DIRECTO
usersCtl.mandarUser = async (req, res) => {
  const userId = req.user?.id || req.body.userId;
  try {
    const { nombre, email, contraseña, avatar, tema, notificaciones, idioma } = req.body;
    
    // Datos para MySQL usando ORM
    const envioSQL = {
      nombre,
      email,
      contraseña,
      avatar,
      estado: true,
      createUser: new Date().toLocaleString(),
    };
    
    const envioUser = await orm.users.create(envioSQL);
    const idUser = envioUser.id;

    // Datos para MongoDB
    const envioMongo = {
      userId: idUser.toString(),
      tema: tema || 'claro',
      notificaciones: notificaciones !== undefined ? notificaciones : true,
      idioma: idioma || 'es',
      createUserMongo: new Date().toLocaleString(),
    };

    await UserPreferences.create(envioMongo);
    
    res.status(201).json({
      message: 'Exito al guardar usuario completo',
      user: envioUser,
      preferences: envioMongo
    });
    
    return 'exito al guardar';

  } catch (error) {
    res.status(400).json({ message: 'Error al envio', error: error.message });
    return error;
  }
};

usersCtl.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await orm.users.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    await user.update(req.body);
    res.json({
      message: 'Usuario actualizado exitosamente',
      user
    });
  } catch (e) {
    res.status(400).json({ message: 'Error al actualizar usuario', error: e.message });
  }
};

usersCtl.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await orm.users.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    // Eliminar también las preferencias del usuario
    await UserPreferences.deleteOne({ userId: id.toString() });
    await user.destroy();
    
    res.json({ message: 'Usuario y preferencias eliminados exitosamente' });
  } catch (e) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: e.message });
  }
};

// FUNCIONES PARA PREFERENCIAS DE USUARIO (MongoDB)
usersCtl.getAllUserPreferences = async (req, res) => {
  try {
    const data = await UserPreferences.find();
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener preferencias', error: e.message });
  }
};

usersCtl.getUserPreferencesById = async (req, res) => {
  try {
    const pref = await UserPreferences.findById(req.params.id);
    if (!pref) return res.status(404).json({ message: 'Preferencia no encontrada' });
    res.json(pref);
  } catch (e) {
    res.status(500).json({ message: 'Error al buscar preferencia', error: e.message });
  }
};

usersCtl.getUserPreferencesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const pref = await UserPreferences.findOne({ userId: userId });
    if (!pref) {
      return res.status(404).json({ 
        message: 'Preferencias no encontradas para este usuario',
        suggestion: 'Crear preferencias por defecto'
      });
    }
    res.json(pref);
  } catch (e) {
    res.status(500).json({ message: 'Error al buscar preferencias del usuario', error: e.message });
  }
};

usersCtl.createUserPreferences = async (req, res) => {
  try {
    const { userId, tema, notificaciones, idioma } = req.body;
    
    // Verificar que el usuario existe en MySQL
    const user = await orm.users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar si ya tiene preferencias
    const existingPref = await UserPreferences.findOne({ userId: userId.toString() });
    if (existingPref) {
      return res.status(400).json({ message: 'El usuario ya tiene preferencias configuradas' });
    }
    
    const preferencesData = {
      userId: userId.toString(),
      tema: tema || 'claro',
      notificaciones: notificaciones !== undefined ? notificaciones : true,
      idioma: idioma || 'es'
    };
    
    const nueva = await UserPreferences.create(preferencesData);
    res.status(201).json({
      message: 'Preferencias creadas exitosamente',
      preferences: nueva
    });
  } catch (e) {
    res.status(400).json({ message: 'Error al crear preferencia', error: e.message });
  }
};

usersCtl.updateUserPreferences = async (req, res) => {
  try {
    const actualizada = await UserPreferences.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!actualizada) return res.status(404).json({ message: 'Preferencia no encontrada' });
    
    res.json({
      message: 'Preferencias actualizadas exitosamente',
      preferences: actualizada
    });
  } catch (e) {
    res.status(400).json({ message: 'Error al actualizar preferencia', error: e.message });
  }
};

usersCtl.updateUserPreferencesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const actualizada = await UserPreferences.findOneAndUpdate(
      { userId: userId }, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!actualizada) return res.status(404).json({ message: 'Preferencias no encontradas para este usuario' });
    
    res.json({
      message: 'Preferencias actualizadas exitosamente',
      preferences: actualizada
    });
  } catch (e) {
    res.status(400).json({ message: 'Error al actualizar preferencias', error: e.message });
  }
};

usersCtl.deleteUserPreferences = async (req, res) => {
  try {
    const eliminada = await UserPreferences.findByIdAndDelete(req.params.id);
    if (!eliminada) return res.status(404).json({ message: 'Preferencia no encontrada' });
    res.json({ message: 'Preferencia eliminada exitosamente' });
  } catch (e) {
    res.status(500).json({ message: 'Error al eliminar preferencia', error: e.message });
  }
};

// FUNCIÓN COMBINADA PARA OBTENER USUARIO CON SUS PREFERENCIAS
usersCtl.getUserWithPreferences = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Obtener usuario desde MySQL
    const user = await orm.users.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    // Obtener preferencias desde MongoDB
    const preferences = await UserPreferences.findOne({ userId: userId.toString() });
    
    const data = {
      user,
      preferences: preferences || {
        message: 'Preferencias no configuradas',
        default: {
          tema: 'claro',
          notificaciones: true,
          idioma: 'es'
        }
      }
    };
    
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener usuario con preferencias', error: e.message });
  }
};

// FUNCIÓN PARA OBTENER TODOS LOS USUARIOS CON SUS PREFERENCIAS
usersCtl.getAllUsersWithPreferences = async (req, res) => {
  try {
    // Obtener todos los usuarios desde MySQL
    const users = await orm.users.findAll();
    
    // Obtener todas las preferencias desde MongoDB
    const allPreferences = await UserPreferences.find();
    
    // Combinar datos
    const usersWithPreferences = users.map(user => {
      const userPreferences = allPreferences.find(pref => pref.userId === user.id.toString());
      return {
        user,
        preferences: userPreferences || null
      };
    });
    
    res.json(usersWithPreferences);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener usuarios con preferencias', error: e.message });
  }
};

module.exports = usersCtl;

