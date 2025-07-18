// controller/usersController.js
const usersCtl = {};
const orm = require('../dataBase/dataBase.orm');
const sql = require('../dataBase/dataBase.sql');
const mongo = require('../dataBase/dataBase.mongo');
const UserPreferences = require('../model/nonRelational/UserPreferences');
const NotificationsLog = require('../model/nonRelational/NotificationsLog');
const { cifrarDatos, descifrarDatos } = require('../lib/encrypDates');

//Varias consultas que se pueden hacer en los metodos

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
    const usuario = await UserPreferences.findOne({ userId: listaUsers[0].id }); //?.id?.toString() no se utiliza esto
    const usuarios = listaUsers[0];
    const data = {
      usuarios,
      usuario   //contraseña no se hcae con el bycrypt si no con el crypto
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
    const { nombre, email, contraseña, avatar, tema = 'claro', idioma = 'es', notificacionesEnabled = true } = req.body;
    
    // 1. Crear usuario en MySQL
    const userData = {
      nombre,
      email,
      contraseña,
      avatar,
      estado: true
    };
    
    const newUser = await orm.users.create(userData);

    // 2. Crear preferencias del usuario en MongoDB automáticamente
    const userPreferences = new UserPreferences({
      userId: newUser.id.toString(),
      tema,
      notificaciones: notificacionesEnabled,
      idioma,
      estado: true
    });

    await userPreferences.save();

    // 3. Crear notificación de bienvenida en MongoDB automáticamente
    const welcomeNotification = new NotificationsLog({
      userId: newUser.id.toString(),
      mensaje: `¡Bienvenido ${nombre}! Tu cuenta ha sido creada exitosamente.`,
      tipo: 'success',
      leido: false,
      estado: true
    });

    await welcomeNotification.save();

    res.status(201).json({
      message: 'Usuario, preferencias y notificación de bienvenida creados exitosamente',
      usuario: newUser,
      preferencias: userPreferences,
      notificacionBienvenida: welcomeNotification
    });
  } catch (e) {
    // Registrar error en notificaciones
    try {
      await NotificationsLog.create({
        userId: '0', // Usuario temporal para errores
        mensaje: `Error al crear cuenta: ${e.message}`,
        tipo: 'error',
        leido: false,
        estado: true
      });
    } catch (notifError) {
      console.error('Error al crear notificación de error:', notifError);
    }
    
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

// FUNCIONES ESPECÍFICAS PARA USER PREFERENCES (MongoDB)

// Obtener preferencias de un usuario específico
usersCtl.getUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await UserPreferences.findOne({ 
      userId: userId.toString(), 
      estado: true 
    });
    res.json(preferences);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener preferencias', error: e.message });
  }
};

// Obtener usuario completo con preferencias y notificaciones
usersCtl.getUserComplete = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Obtener usuario de MySQL
    const user = await orm.users.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    // Obtener preferencias de MongoDB
    const preferences = await UserPreferences.findOne({ 
      userId: userId.toString(), 
      estado: true 
    });
    
    // Obtener notificaciones recientes de MongoDB
    const notifications = await NotificationsLog.find({ 
      userId: userId.toString(), 
      estado: true 
    }).sort({ createdAt: -1 }).limit(10);
    
    res.json({
      usuario: user,
      preferencias: preferences,
      notificaciones: notifications,
      totalNotificaciones: notifications.length,
      notificacionesNoLeidas: notifications.filter(n => !n.leido).length
    });
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener datos completos', error: e.message });
  }
};

// Actualizar preferencias del usuario
usersCtl.updateUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tema, notificaciones, idioma } = req.body;
    
    const updatedPreferences = await UserPreferences.findOneAndUpdate(
      { userId: userId.toString(), estado: true },
      { tema, notificaciones, idioma },
      { new: true }
    );
    
    if (!updatedPreferences) return res.status(404).json({ message: 'Preferencias no encontradas' });
    
    // Crear notificación de actualización
    await NotificationsLog.create({
      userId: userId.toString(),
      mensaje: 'Tus preferencias han sido actualizadas exitosamente',
      tipo: 'info',
      leido: false,
      estado: true
    });
    
    res.json({ message: 'Preferencias actualizadas', preferencias: updatedPreferences });
  } catch (e) {
    res.status(400).json({ message: 'Error al actualizar preferencias', error: e.message });
  }
};

// FUNCIONES ESPECÍFICAS PARA NOTIFICATIONS LOG (MongoDB)

// Obtener notificaciones de un usuario específico
usersCtl.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limite = 20, pagina = 1 } = req.query;
    
    const notifications = await NotificationsLog.find({ 
      userId: userId.toString(), 
      estado: true 
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limite))
    .skip((parseInt(pagina) - 1) * parseInt(limite));
    
    res.json(notifications);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener notificaciones', error: e.message });
  }
};

// Crear notificación manual para un usuario
usersCtl.createNotification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { mensaje, tipo } = req.body;
    
    const newNotification = new NotificationsLog({
      userId: userId.toString(),
      mensaje,
      tipo: tipo || 'info',
      leido: false,
      estado: true
    });
    
    await newNotification.save();
    res.json({ message: 'Notificación creada', notificacion: newNotification });
  } catch (e) {
    res.status(400).json({ message: 'Error al crear notificación', error: e.message });
  }
};

// Marcar notificación como leída
usersCtl.markNotificationAsRead = async (req, res) => {
  try {
    const { userId, notificationId } = req.params;
    
    const updatedNotification = await NotificationsLog.findOneAndUpdate(
      { _id: notificationId, userId: userId.toString() },
      { leido: true },
      { new: true }
    );
    
    if (!updatedNotification) return res.status(404).json({ message: 'Notificación no encontrada' });
    res.json({ message: 'Notificación marcada como leída', notificacion: updatedNotification });
  } catch (e) {
    res.status(400).json({ message: 'Error al marcar notificación', error: e.message });
  }
};

// Marcar todas las notificaciones como leídas
usersCtl.markAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await NotificationsLog.updateMany(
      { userId: userId.toString(), leido: false, estado: true },
      { leido: true }
    );
    
    res.json({ 
      message: 'Todas las notificaciones marcadas como leídas', 
      actualizadas: result.modifiedCount 
    });
  } catch (e) {
    res.status(400).json({ message: 'Error al marcar notificaciones', error: e.message });
  }
};

// Eliminar notificaciones antiguas
usersCtl.cleanOldNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { diasAtras = 30 } = req.body;
    
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - diasAtras);
    
    const result = await NotificationsLog.deleteMany({
      userId: userId.toString(),
      createdAt: { $lt: fechaLimite },
      leido: true
    });
    
    res.json({ 
      message: 'Notificaciones antiguas eliminadas', 
      eliminadas: result.deletedCount 
    });
  } catch (e) {
    res.status(500).json({ message: 'Error al limpiar notificaciones', error: e.message });
  }
};

// Obtener estadísticas de notificaciones
usersCtl.getNotificationStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const totalNotifications = await NotificationsLog.countDocuments({ 
      userId: userId.toString(), 
      estado: true 
    });
    
    const unreadNotifications = await NotificationsLog.countDocuments({ 
      userId: userId.toString(), 
      estado: true, 
      leido: false 
    });
    
    const notificationsByType = await NotificationsLog.aggregate([
      { $match: { userId: userId.toString(), estado: true } },
      { $group: { _id: '$tipo', count: { $sum: 1 } } }
    ]);
    
    res.json({
      userId: userId,
      totalNotificaciones: totalNotifications,
      noLeidas: unreadNotifications,
      leidas: totalNotifications - unreadNotifications,
      porTipo: notificationsByType
    });
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: e.message });
  }
};

module.exports = usersCtl;

