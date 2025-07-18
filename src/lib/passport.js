const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const orm = require('../dataBase/dataBase.orm');
const mongo = require('../dataBase/dataBase.mongo'); // Importar conexión a MongoDB
const bcrypt = require('bcrypt');
const { cifrarDatos, descifrarDatos } = require('./encrypDates');
const UserPreferences = require('../model/nonRelational/UserPreferences');
const NotificationsLog = require('../model/nonRelational/NotificationsLog');


// ==================== ESTRATEGIA DE LOGIN ====================
passport.use(
    'local.signin',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'contraseña',
            passReqToCallback: true,
        },
        async (req, email, contraseña, done) => {
            try {
                // Buscar usuario por email
                const usuario = await orm.users.findOne({ where: { email: email } });
                
                if (!usuario) {
                    return done(null, false, req.flash("message", "El usuario no existe."));
                }

                // Verificar si el usuario está activo
                if (!usuario.estado) {
                    return done(null, false, req.flash("message", "Usuario desactivado. Contacte al administrador."));
                }

                // Comparar contraseña (si usas hash)
                // const isValidPassword = await bcrypt.compare(contraseña, usuario.contraseña);
                // Si no usas hash, comparación directa:
                const isValidPassword = contraseña === usuario.contraseña;

                if (!isValidPassword) {
                    return done(null, false, req.flash("message", "Contraseña incorrecta."));
                }

                // Obtener preferencias del usuario desde MongoDB
                const userPreferences = await UserPreferences.findOne({ userId: usuario.id.toString() });

                // Crear objeto de usuario completo para la sesión
                const userComplete = {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    avatar: usuario.avatar,
                    estado: usuario.estado,
                    preferencias: userPreferences || null
                };

                return done(null, userComplete, req.flash("success", `¡Bienvenido ${usuario.nombre}!`));

            } catch (error) {
                console.error('Error en login:', error);
                return done(error);
            }
        }
    )
);

// ==================== ESTRATEGIA DE REGISTRO ====================
passport.use(
    'local.signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'contraseña',
            passReqToCallback: true,
        },
        async (req, email, contraseña, done) => {
            try {
                // Verificar si el usuario ya existe
                const existingUser = await orm.users.findOne({ where: { email: email } });
                if (existingUser) {
                    return done(null, false, req.flash('message', 'El email ya está registrado.'));
                }

                const { nombre, avatar, tema = 'claro', idioma = 'es', notificacionesEnabled = true } = req.body;

                // Hashear contraseña (recomendado para producción)
                // const hashedPassword = await bcrypt.hash(contraseña, 10);

                // 1. Crear usuario en MySQL
                const newUser = await orm.users.create({
                    nombre,
                    email,
                    contraseña, // En producción usar: hashedPassword
                    avatar: avatar || null,
                    estado: true
                });

                // 2. Crear preferencias del usuario en MongoDB
                const userPreferences = new UserPreferences({
                    userId: newUser.id.toString(),
                    tema,
                    notificaciones: notificacionesEnabled,
                    idioma,
                    estado: true
                });
                await userPreferences.save();

                // 3. Crear notificación de bienvenida
                const welcomeNotification = new NotificationsLog({
                    userId: newUser.id.toString(),
                    mensaje: `¡Bienvenido ${nombre}! Tu cuenta ha sido creada exitosamente.`,
                    tipo: 'success',
                    leido: false,
                    estado: true
                });
                await welcomeNotification.save();

                // Objeto completo para la sesión
                const userComplete = {
                    id: newUser.id,
                    nombre: newUser.nombre,
                    email: newUser.email,
                    avatar: newUser.avatar,
                    estado: newUser.estado,
                    preferencias: userPreferences
                };

                return done(null, userComplete, req.flash('success', `¡Cuenta creada exitosamente! Bienvenido ${nombre}.`));

            } catch (error) {
                console.error('Error en registro:', error);
                return done(error);
            }
        }
    )
);
//doble ingreso relacion no realcional
// Serialización para manejo de sesiones
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        // Obtener usuario de MySQL
        const usuario = await orm.users.findByPk(id);
        if (!usuario) {
            return done(null, false);
        }

        // Obtener preferencias de MongoDB
        const userPreferences = await UserPreferences.findOne({ userId: id.toString() });

        // Objeto completo del usuario
        const userComplete = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            avatar: usuario.avatar,
            estado: usuario.estado,
            preferencias: userPreferences || null
        };

        done(null, userComplete);
    } catch (error) {
        console.error('Error en deserialización:', error);
        done(error, null);
    }
});

module.exports = passport;