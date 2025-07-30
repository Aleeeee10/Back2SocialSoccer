// controller/usersController.js
const usersCtl = {};
// Importa los modelos de ambas bases de datos y las utilidades
const orm = require('../dataBase/dataBase.orm'); // Para Sequelize (SQL)
const sql = require('../dataBase/dataBase.sql'); // MySQL directo
const mongo = require('../dataBase/dataBase.mongo'); // Para Mongoose (MongoDB)
const UserPreferences = require('../model/nonRelational/UserPreferences'); // Modelo no relacional para preferencias de usuario
const NotificationsLog = require('../model/nonRelational/NotificationsLog'); // Modelo no relacional para log de notificaciones
const { encryptDates, decryptDates, cifrarDato, descifrarDato } = require('../lib/helpers');

// --- Utilidad para Descifrado Seguro ---
function safeDecrypt(data) {
    try {
        return data ? descifrarDato(data) : '';
    } catch (error) {
        console.error('Error al descifrar datos:', error.message);
        return '';
    }
}

// Función para formatear una fecha a 'YYYY-MM-DD HH:mm:ss'
function formatLocalDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses son 0-index
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// --- CRUD de Usuarios ---

// 1. CREAR NUEVO USUARIO
usersCtl.createUser = async (req, res) => {
    const { nombre, email, contraseña, tema = 'claro', idioma = 'es', notificacionesEnabled = true, rolId } = req.body;
    try {
        const now = new Date();
        const formattedNow = formatLocalDateTime(now);

        // 🔐 Si no se especifica rol, asignar "Usuario" por defecto
        let roleIdToUse = rolId;
        if (!roleIdToUse) {
            // Buscar el rol "Usuario" por defecto
            const [defaultRole] = await sql.promise().query("SELECT idRoles FROM roles WHERE nameRole = 'Usuario' AND stateRole = 'activo' LIMIT 1");
            if (defaultRole.length > 0) {
                roleIdToUse = defaultRole[0].idRoles;
                console.log(`✅ Asignando rol "Usuario" por defecto (ID: ${roleIdToUse}) al nuevo usuario`);
            } else {
                return res.status(500).json({ 
                    error: 'No se encontró el rol "Usuario" en el sistema. Contacta al administrador.' 
                });
            }
        }

        // ✅ CORREGIDO: 1. Crear usuario en MySQL usando nombres de columnas correctos (SIN avatar)
        const [resultado] = await sql.promise().query(`
            INSERT INTO users (nameUser, emailUser, passwordUser, stateUser, createUser, idRole) 
            VALUES (?, ?, ?, 'activo', ?, ?)
        `, [nombre, email, contraseña, formattedNow, roleIdToUse]);

        const userId = resultado.insertId;

        // 2. Crear preferencias del usuario en MongoDB automáticamente
        const userPreferences = new UserPreferences({
            userId: userId.toString(),
            tema,
            notificaciones: notificacionesEnabled,
            idioma,
            estado: true,
            fechaCreacion: new Date()
        });

        await userPreferences.save();

        // 3. Crear notificación de bienvenida en MongoDB automáticamente
        const welcomeNotification = new NotificationsLog({
            userId: userId.toString(),
            mensaje: `¡Bienvenido ${nombre}! Tu cuenta ha sido creada exitosamente.`,
            tipo: 'success',
            leido: false,
            estado: true,
            fechaCreacion: new Date()
        });

        await welcomeNotification.save();

        // 4. Obtener el usuario completo para la respuesta (con información del rol)
        const [usuarioCreado] = await sql.promise().query(`
            SELECT u.*, r.nameRole as rol_nombre, r.descriptionRole as rol_descripcion 
            FROM users u 
            LEFT JOIN roles r ON u.idRole = r.idRoles 
            WHERE u.idUsers = ?
        `, [userId]);

        res.status(201).json({
            message: 'Usuario, preferencias y notificación de bienvenida creados exitosamente',
            usuario: {
                ...usuarioCreado[0],
                passwordUser: '***PROTEGIDA***' // No enviar contraseña al frontend
            },
            preferencias: userPreferences,
            notificacionBienvenida: welcomeNotification
        });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 2. OBTENER TODOS LOS USUARIOS (Usando SQL Directo)
usersCtl.getAllUsers = async (req, res) => {
    try {
        // ✅ CORREGIDO: Usar stateUser en lugar de estado
        const [usersSQL] = await sql.promise().query(`
            SELECT u.*, r.nameRole as roleName 
            FROM users u 
            LEFT JOIN roles r ON u.idRole = r.idRoles 
            WHERE u.stateUser = 'activo' 
            ORDER BY u.nameUser ASC
        `);
        
        res.status(200).json(usersSQL);
    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 3. OBTENER USUARIO POR ID (Usando SQL Directo)
usersCtl.getById = async (req, res) => {
    const { id } = req.params;
    
    try {
        // ✅ CORREGIDO: Usar idUsers y stateUser en lugar de id y estado
        const [usersSQL] = await sql.promise().query(`
            SELECT u.*, r.nameRole as roleName 
            FROM users u 
            LEFT JOIN roles r ON u.idRole = r.idRoles 
            WHERE u.idUsers = ? AND u.stateUser = 'activo'
        `, [id]);
        
        if (usersSQL.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        
        const userSQL = usersSQL[0];
        
        res.status(200).json(userSQL);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 4. MOSTRAR USUARIOS CON INFORMACIÓN DETALLADA (Usando SQL Directo + MongoDB)
usersCtl.mostrarUsers = async (req, res) => {
    try {
        // ✅ CORREGIDO: Usar nombres de columnas correctos
        const query = `
            SELECT u.*,
                   CASE 
                     WHEN u.stateUser = 'activo' THEN '✅ Activo'
                     WHEN u.stateUser = 'inactivo' THEN '⏸️ Inactivo'
                     ELSE '❌ Eliminado'
                   END as estado_detallado,
                   CASE 
                     WHEN u.createUser >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN '🆕 Nuevo'
                     WHEN u.createUser >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN '⭐ Reciente'
                     ELSE '👤 Usuario'
                   END as tipo_usuario,
                   DATEDIFF(NOW(), u.createUser) as dias_registrado
            FROM users u
            WHERE u.stateUser != 'eliminado'
            ORDER BY u.createUser DESC
        `;
        
        const [usuarios] = await sql.promise().query(query);
        
        // Obtener información de preferencias de algunos usuarios como muestra
        let preferencesInfo = null;
        if (usuarios.length > 0) {
            preferencesInfo = await UserPreferences.findOne({ 
                userId: usuarios[0].idUsers.toString(), // ✅ CORREGIDO: usar idUsers
                estado: true 
            });
        }
        
        res.status(200).json({
            message: 'Usuarios con información detallada obtenidos exitosamente',
            usuarios: usuarios,
            preferencesInfo: preferencesInfo,
            total: usuarios.length,
            estadisticas: {
                activos: usuarios.filter(u => u.stateUser === 'activo').length, // ✅ CORREGIDO
                nuevos: usuarios.filter(u => u.tipo_usuario.includes('Nuevo')).length,
                recientes: usuarios.filter(u => u.tipo_usuario.includes('Reciente')).length
            }
        });
    } catch (error) {
        console.error('Error al mostrar los usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 5. ACTUALIZAR USUARIO (Usando SQL Directo)
usersCtl.update = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, contraseña, roleId } = req.body;
    
    try {
        // Preparar datos para SQL (solo los que no son undefined)
        const campos = [];
        const valores = [];
        const now = new Date();
        const formattedNow = formatLocalDateTime(now);

        // ✅ CORREGIDO: Usar nombres de columnas correctos (SIN avatar)
        if (nombre) {
            campos.push('nameUser = ?');
            valores.push(nombre);
        }
        if (email) {
            campos.push('emailUser = ?');
            valores.push(email);
        }
        if (contraseña) {
            campos.push('passwordUser = ?');
            valores.push(contraseña);
        }
        if (roleId) {
            campos.push('idRole = ?');
            valores.push(roleId);
        }
        
        // Siempre actualizar updateUser
        campos.push('updateUser = ?');
        valores.push(formattedNow);

        if (campos.length > 0) {
            valores.push(id);
            // ✅ CORREGIDO: Usar idUsers y stateUser
            const consultaSQL = `UPDATE users SET ${campos.join(', ')} WHERE idUsers = ? AND stateUser != 'eliminado'`;
            const [resultado] = await sql.promise().query(consultaSQL, valores);
            
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }
        }
        
        res.status(200).json({ message: 'Usuario actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 6. ELIMINAR USUARIO (Usando SQL Directo)
usersCtl.delete = async (req, res) => {
    const { id } = req.params;
    
    try {
        const now = new Date();
        const formattedNow = formatLocalDateTime(now);

        // ✅ CORREGIDO: Usar nombres de columnas correctos
        const [userInfo] = await sql.promise().query(`
            SELECT * FROM users 
            WHERE idUsers = ? AND stateUser != 'eliminado'
        `, [id]);
        
        if (userInfo.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Eliminar preferencias y notificaciones relacionadas (eliminación lógica en MongoDB)
        await UserPreferences.updateMany(
            { userId: id.toString() },
            { estado: false }
        );

        await NotificationsLog.updateMany(
            { userId: id.toString() },
            { estado: false }
        );

        // ✅ CORREGIDO: SQL directo para actualizar estado a 'eliminado'
        const [resultado] = await sql.promise().query(`
            UPDATE users 
            SET stateUser = 'eliminado', updateUser = ? 
            WHERE idUsers = ? AND stateUser != 'eliminado'
        `, [formattedNow, id]);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        
        res.status(200).json({ message: 'Usuario y datos relacionados eliminados correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 7. MANDAR USUARIO CON ENCRIPTACIÓN COMPLETA
usersCtl.mandarUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        const [usersSQL] = await sql.promise().query("SELECT * FROM users WHERE id = ? AND estado != 'eliminado'", [id]);
        
        if (usersSQL.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        
        const userSQL = usersSQL[0];
        
        // Encriptar datos sensibles del usuario
        const userEncriptado = {
            ...userSQL,
            // 🔐 Datos sensibles que DEBEN encriptarse
            contraseña: '***PROTEGIDA***', // Nunca enviar contraseña
            email: userSQL.email ? encryptDates(userSQL.email) : null,
            telefono: userSQL.telefono ? encryptDates(userSQL.telefono) : null,
            
            // 🔐 Fechas sensibles
            fecha_creacion: userSQL.fecha_creacion ? encryptDates(userSQL.fecha_creacion) : null,
            fecha_modificacion: userSQL.fecha_modificacion ? encryptDates(userSQL.fecha_modificacion) : null,
            fecha_ultimo_acceso: userSQL.fecha_ultimo_acceso ? encryptDates(userSQL.fecha_ultimo_acceso) : null,
            
            // 🔐 Metadatos de consulta
            fechaConsulta: encryptDates(new Date()),
            consultadoPor: req.user?.id || 'sistema',
            
            // 🔐 Datos públicos (NO encriptados)
            nombre: userSQL.nombre,
            avatar: userSQL.avatar,
            estado: userSQL.estado,
            id: userSQL.id
        };
        
        res.status(200).json({
            message: 'Usuario obtenido con datos encriptados',
            usuario: userEncriptado,
            nota: 'Los datos sensibles están encriptados'
        });
    } catch (error) {
        console.error('Error al mandar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// --- FUNCIONES ESPECÍFICAS PARA USER PREFERENCES (MongoDB) ---

// 8. OBTENER PREFERENCIAS DE UN USUARIO
usersCtl.getUserPreferences = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const preferences = await UserPreferences.findOne({ 
            userId: userId.toString(), 
            estado: true 
        });
        
        if (!preferences) {
            return res.status(404).json({ error: 'Preferencias del usuario no encontradas.' });
        }
        
        res.status(200).json({
            message: 'Preferencias obtenidas exitosamente',
            userId: userId,
            preferencias: preferences
        });
    } catch (error) {
        console.error('Error al obtener preferencias:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 9. OBTENER USUARIO COMPLETO CON PREFERENCIAS Y NOTIFICACIONES
usersCtl.getUserComplete = async (req, res) => {
    const { userId } = req.params;
    
    try {
        // Obtener usuario de MySQL
        const [usersSQL] = await sql.promise().query("SELECT * FROM users WHERE id = ? AND estado != 'eliminado'", [userId]);
        
        if (usersSQL.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        
        const user = usersSQL[0];
        
        // Obtener preferencias de MongoDB
        const preferences = await UserPreferences.findOne({ 
            userId: userId.toString(), 
            estado: true 
        });
        
        // Obtener notificaciones recientes de MongoDB
        const notifications = await NotificationsLog.find({ 
            userId: userId.toString(), 
            estado: true 
        }).sort({ fechaCreacion: -1 }).limit(10);
        
        res.status(200).json({
            message: 'Usuario completo obtenido exitosamente',
            usuario: user,
            preferencias: preferences,
            notificaciones: notifications,
            totalNotificaciones: notifications.length,
            notificacionesNoLeidas: notifications.filter(n => !n.leido).length
        });
    } catch (error) {
        console.error('Error al obtener datos completos del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 10. ACTUALIZAR PREFERENCIAS DEL USUARIO
usersCtl.updateUserPreferences = async (req, res) => {
    const { userId } = req.params;
    const { tema, notificaciones, idioma } = req.body;
    
    try {
        const updatedPreferences = await UserPreferences.findOneAndUpdate(
            { userId: userId.toString(), estado: true },
            { tema, notificaciones, idioma },
            { new: true }
        );
        
        if (!updatedPreferences) {
            return res.status(404).json({ error: 'Preferencias del usuario no encontradas.' });
        }
        
        // Crear notificación de actualización
        const updateNotification = new NotificationsLog({
            userId: userId.toString(),
            mensaje: 'Tus preferencias han sido actualizadas exitosamente',
            tipo: 'info',
            leido: false,
            estado: true,
            fechaCreacion: new Date()
        });
        
        await updateNotification.save();
        
        res.status(200).json({ 
            message: 'Preferencias actualizadas exitosamente', 
            preferencias: updatedPreferences,
            notificacion: updateNotification
        });
    } catch (error) {
        console.error('Error al actualizar preferencias:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 11. OBTENER NOTIFICACIONES DEL USUARIO
usersCtl.getUserNotifications = async (req, res) => {
    const { userId } = req.params;
    const { limite = 20, pagina = 1 } = req.query;
    
    try {
        const notifications = await NotificationsLog.find({ 
            userId: userId.toString(), 
            estado: true 
        })
        .sort({ fechaCreacion: -1 })
        .limit(parseInt(limite))
        .skip((parseInt(pagina) - 1) * parseInt(limite));
        
        const totalNotifications = await NotificationsLog.countDocuments({ 
            userId: userId.toString(), 
            estado: true 
        });
        
        res.status(200).json({
            message: 'Notificaciones obtenidas exitosamente',
            notificaciones: notifications,
            paginacion: {
                pagina: parseInt(pagina),
                limite: parseInt(limite),
                total: totalNotifications,
                totalPaginas: Math.ceil(totalNotifications / parseInt(limite))
            }
        });
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 12. CREAR NOTIFICACIÓN PARA UN USUARIO
usersCtl.createNotification = async (req, res) => {
    const { userId } = req.params;
    const { mensaje, tipo = 'info' } = req.body;
    
    try {
        // Verificar que el usuario existe
        const [userExists] = await sql.promise().query("SELECT id FROM users WHERE id = ? AND estado != 'eliminado'", [userId]);
        
        if (userExists.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        
        const newNotification = new NotificationsLog({
            userId: userId.toString(),
            mensaje,
            tipo,
            leido: false,
            estado: true,
            fechaCreacion: new Date()
        });
        
        await newNotification.save();
        
        res.status(201).json({ 
            message: 'Notificación creada exitosamente', 
            notificacion: newNotification 
        });
    } catch (error) {
        console.error('Error al crear notificación:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 13. MARCAR NOTIFICACIÓN COMO LEÍDA
usersCtl.markNotificationAsRead = async (req, res) => {
    const { userId, notificationId } = req.params;
    
    try {
        const updatedNotification = await NotificationsLog.findOneAndUpdate(
            { _id: notificationId, userId: userId.toString(), estado: true },
            { leido: true },
            { new: true }
        );
        
        if (!updatedNotification) {
            return res.status(404).json({ error: 'Notificación no encontrada.' });
        }
        
        res.status(200).json({ 
            message: 'Notificación marcada como leída', 
            notificacion: updatedNotification 
        });
    } catch (error) {
        console.error('Error al marcar notificación:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 14. MARCAR TODAS LAS NOTIFICACIONES COMO LEÍDAS
usersCtl.markAllNotificationsAsRead = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const result = await NotificationsLog.updateMany(
            { userId: userId.toString(), leido: false, estado: true },
            { leido: true }
        );
        
        res.status(200).json({ 
            message: 'Todas las notificaciones marcadas como leídas', 
            actualizadas: result.modifiedCount 
        });
    } catch (error) {
        console.error('Error al marcar notificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 15. OBTENER ESTADÍSTICAS DE NOTIFICACIONES
usersCtl.getNotificationStats = async (req, res) => {
    const { userId } = req.params;
    
    try {
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
        
        res.status(200).json({
            message: 'Estadísticas de notificaciones obtenidas exitosamente',
            userId: userId,
            estadisticas: {
                totalNotificaciones: totalNotifications,
                noLeidas: unreadNotifications,
                leidas: totalNotifications - unreadNotifications,
                porTipo: notificationsByType
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 16. LIMPIAR NOTIFICACIONES ANTIGUAS
usersCtl.cleanOldNotifications = async (req, res) => {
    const { userId } = req.params;
    const { diasAtras = 30 } = req.body;
    
    try {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - diasAtras);
        
        const result = await NotificationsLog.deleteMany({
            userId: userId.toString(),
            fechaCreacion: { $lt: fechaLimite },
            leido: true,
            estado: true
        });
        
        res.status(200).json({ 
            message: 'Notificaciones antiguas eliminadas exitosamente', 
            eliminadas: result.deletedCount,
            diasAtras: diasAtras
        });
    } catch (error) {
        console.error('Error al limpiar notificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 17. BUSCAR USUARIOS
usersCtl.searchUsers = async (req, res) => {
    const { q, estado } = req.query;
    
    try {
        let query = `
            SELECT u.*,
                   CASE 
                     WHEN u.estado = 'activo' THEN '✅ Activo'
                     WHEN u.estado = 'inactivo' THEN '⏸️ Inactivo'
                     ELSE '❌ Eliminado'
                   END as estado_detallado
            FROM users u
            WHERE u.estado != 'eliminado'
        `;
        
        const params = [];
        
        if (q) {
            query += ` AND (u.nombre LIKE ? OR u.email LIKE ?)`;
            params.push(`%${q}%`, `%${q}%`);
        }
        
        if (estado) {
            query += ` AND u.estado = ?`;
            params.push(estado);
        }
        
        query += ` ORDER BY u.nombre ASC`;
        
        const [resultados] = await sql.promise().query(query, params);
        
        res.status(200).json({
            message: 'Búsqueda de usuarios realizada exitosamente',
            resultados: resultados,
            filtros: { q, estado },
            total: resultados.length
        });
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 18. OBTENER ESTADÍSTICAS GENERALES DE USUARIOS
usersCtl.getGeneralStats = async (req, res) => {
    try {
        const [estadisticasSQL] = await sql.promise().query(`
            SELECT 
                COUNT(CASE WHEN u.estado = 'activo' THEN 1 END) as usuarios_activos,
                COUNT(CASE WHEN u.estado = 'inactivo' THEN 1 END) as usuarios_inactivos,
                COUNT(CASE WHEN u.estado = 'eliminado' THEN 1 END) as usuarios_eliminados,
                COUNT(CASE WHEN u.fecha_creacion >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as nuevos_esta_semana,
                COUNT(CASE WHEN u.fecha_creacion >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as nuevos_este_mes,
                COUNT(u.id) as total_usuarios,
                AVG(DATEDIFF(NOW(), u.fecha_creacion)) as promedio_dias_registro
            FROM users u
            WHERE u.estado != 'eliminado'
        `);
        
        const estadisticas = estadisticasSQL[0];
        
        res.status(200).json({
            message: 'Estadísticas generales de usuarios obtenidas exitosamente',
            estadisticas: estadisticas
        });
    } catch (error) {
        console.error('Error al obtener estadísticas generales:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 19. OBTENER USUARIO DESENCRIPTADO (SOLO ADMINISTRADORES)
usersCtl.getUserDecrypted = async (req, res) => {
    const { id } = req.params;
    
    try {
        // 🛡️ Verificación de permisos (solo admin)
        if (req.user?.role !== 'Administrador') {
            return res.status(403).json({ 
                error: 'Acceso denegado. Solo administradores pueden ver datos desencriptados.' 
            });
        }
        
        const [usersSQL] = await sql.promise().query("SELECT * FROM users WHERE id = ? AND estado != 'eliminado'", [id]);
        
        if (usersSQL.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        
        const userSQL = usersSQL[0];
        
        // 🔓 Usuario con datos desencriptados (solo para admin)
        const userDesencriptado = {
            ...userSQL,
            contraseña: '***PROTEGIDA***', // Nunca mostrar contraseña real
            fechaConsulta: new Date(),
            consultadoPorAdmin: req.user?.id,
            nivelAcceso: 'ADMIN_FULL_ACCESS'
        };
        
        res.status(200).json({
            message: 'Usuario obtenido con acceso administrativo',
            usuario: userDesencriptado,
            advertencia: 'Datos sensibles visibles - Acceso administrativo'
        });
    } catch (error) {
        console.error('Error al obtener usuario desencriptado:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 20. CREAR USUARIO CON ENCRIPTACIÓN AUTOMÁTICA
usersCtl.createUserEncrypted = async (req, res) => {
    const { nombre, email, contraseña, avatar, telefono, tema = 'claro', idioma = 'es', notificacionesEnabled = true } = req.body;
    try {
        const now = new Date();
        const formattedNow = formatLocalDateTime(now);

        // 🔐 Encriptar datos sensibles antes de guardar
        const emailEncriptado = encryptDates(email);
        const telefonoEncriptado = telefono ? encryptDates(telefono) : null;

        // 1. Crear usuario en MySQL con datos encriptados
        const [resultado] = await sql.promise().query(
            "INSERT INTO users (nombre, email, telefono, contraseña, avatar, estado, fecha_creacion) VALUES (?, ?, ?, ?, ?, 'activo', ?)",
            [nombre, emailEncriptado, telefonoEncriptado, contraseña, avatar, formattedNow]
        );

        const userId = resultado.insertId;

        // 2. Crear preferencias del usuario en MongoDB
        const userPreferences = new UserPreferences({
            userId: userId.toString(),
            tema,
            notificaciones: notificacionesEnabled,
            idioma,
            estado: true,
            fechaCreacion: new Date()
        });

        await userPreferences.save();

        // 3. Crear notificación de bienvenida
        const welcomeNotification = new NotificationsLog({
            userId: userId.toString(),
            mensaje: `¡Bienvenido ${nombre}! Tu cuenta ha sido creada exitosamente con protección de datos.`,
            tipo: 'success',
            leido: false,
            estado: true,
            fechaCreacion: new Date()
        });

        await welcomeNotification.save();

        res.status(201).json({
            message: 'Usuario creado con encriptación de datos sensibles',
            usuario: {
                id: userId,
                nombre: nombre,
                estado: 'activo',
                datosEncriptados: true
            },
            preferencias: userPreferences,
            notificacionBienvenida: welcomeNotification
        });
    } catch (error) {
        console.error('Error al crear el usuario encriptado:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 21. ACTUALIZAR USUARIO CON ENCRIPTACIÓN
usersCtl.updateUserEncrypted = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, contraseña, avatar, estado } = req.body;
    
    try {
        const campos = [];
        const valores = [];
        const now = new Date();
        const formattedNow = formatLocalDateTime(now);

        if (nombre) {
            campos.push('nombre = ?');
            valores.push(nombre);
        }
        if (email) {
            // 🔐 Encriptar email antes de actualizar
            campos.push('email = ?');
            valores.push(encryptDates(email));
        }
        if (telefono) {
            // 🔐 Encriptar teléfono antes de actualizar
            campos.push('telefono = ?');
            valores.push(encryptDates(telefono));
        }
        if (contraseña) {
            campos.push('contraseña = ?');
            valores.push(contraseña);
        }
        if (avatar) {
            campos.push('avatar = ?');
            valores.push(avatar);
        }
        if (estado) {
            campos.push('estado = ?');
            valores.push(estado);
        }
        
        // Siempre actualizar fecha_modificacion
        campos.push('fecha_modificacion = ?');
        valores.push(formattedNow);

        if (campos.length > 0) {
            valores.push(id);
            const consultaSQL = `UPDATE users SET ${campos.join(', ')} WHERE id = ? AND estado != 'eliminado'`;
            const [resultado] = await sql.promise().query(consultaSQL, valores);
            
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }
        }
        
        // Crear notificación de actualización
        const updateNotification = new NotificationsLog({
            userId: id.toString(),
            mensaje: 'Tus datos han sido actualizados con protección de encriptación',
            tipo: 'info',
            leido: false,
            estado: true,
            fechaCreacion: new Date()
        });
        
        await updateNotification.save();
        
        res.status(200).json({ 
            message: 'Usuario actualizado con encriptación de datos sensibles',
            datosEncriptados: true,
            notificacion: updateNotification
        });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// 22. FUNCIÓN UTILITARIA PARA DESENCRIPTAR DATOS DE USUARIO (USO INTERNO)
function decryptUserData(encryptedUser) {
    try {
        return {
            ...encryptedUser,
            email: encryptedUser.email ? decryptDates(encryptedUser.email) : null,
            telefono: encryptedUser.telefono ? decryptDates(encryptedUser.telefono) : null,
            fecha_creacion: encryptedUser.fecha_creacion ? decryptDates(encryptedUser.fecha_creacion) : null,
            fecha_modificacion: encryptedUser.fecha_modificacion ? decryptDates(encryptedUser.fecha_modificacion) : null
        };
    } catch (error) {
        console.error('Error al desencriptar datos del usuario:', error);
        return encryptedUser; // Retornar datos originales si falla
    }
}

module.exports = usersCtl;

