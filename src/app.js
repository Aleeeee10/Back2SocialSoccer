// Importar módulos necesarios
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const fileUpload = require("express-fileupload");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const winston = require('winston');
const fs = require('fs');
const crypto = require('crypto');
const hpp = require('hpp');
const toobusy = require('toobusy-js');

// Importar módulos locales
const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT } = require('./keys');
require('./lib/passport');

async function createApp() {
  // Crear aplicación Express
  const app = express();

  // ==================== CONFIGURACIÓN BÁSICA ====================
  app.set('port', process.env.PORT || 3000);

  // ==================== CONFIGURACIÓN DE LOGS MEJORADA ====================

  // 1. Configuración de directorio de logs
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
  }

  // 2. Configuración de Winston para logs unificados (consola y archivo)
  const logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
          winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
          }),
          winston.format.printf(info => {
              return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
          })
      ),
      transports: [
          // Transporte para archivo (siempre activo)
          new winston.transports.File({
              filename: path.join(logDir, 'app.log'),
              maxsize: 10 * 1024 * 1024, // 10MB
              maxFiles: 5,
              tailable: true
          }),
          // Transporte para consola (siempre activo)
          new winston.transports.Console({
              format: winston.format.combine(
                  winston.format.colorize(),
                  winston.format.simple()
              )
          })
      ]
  });

  // Sobrescribir los métodos console para redirigir a Winston
  console.log = (...args) => logger.info(args.join(' '));
  console.info = (...args) => logger.info(args.join(' '));
  console.warn = (...args) => logger.warn(args.join(' '));
  console.error = (...args) => logger.error(args.join(' '));
  console.debug = (...args) => logger.debug(args.join(' '));

  // 3. Configurar Morgan para usar Winston
  const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(morganFormat, {
      stream: {
          write: (message) => {
              // Eliminar saltos de línea innecesarios
              const cleanedMessage = message.replace(/\n$/, '');
              logger.info(cleanedMessage);
          }
      }
  }));

  // ==================== CONFIGURACIÓN DE SEGURIDAD MEJORADA ====================

  // 4. Middleware de protección contra sobrecarga del servidor
  app.use((req, res, next) => {
      if (toobusy()) {
          logger.warn('Server too busy!');
          res.status(503).json({ error: 'Server too busy. Please try again later.' });
      } else {
          next();
      }
  });

  // 5. Habilitar CORS (configura según tus necesidades)
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true
  }));

  // 6. Protección contra HTTP Parameter Pollution
  app.use(hpp());

  // 7. Limitar tamaño de payload
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  // 8. Rate limiting para prevenir ataques de fuerza bruta
  const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      handler: (req, res) => {
          logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
          res.status(429).json({
              error: 'Too many requests, please try again later.'
          });
      }
  });
  app.use(limiter);

  // 9. Configuración de Helmet mejorada
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "script-src": [
            "'self'", "'unsafe-inline'", "'unsafe-eval'",
            "https://maps.googleapis.com", "https://cdnjs.cloudflare.com",
            "https://cdn.jsdelivr.net", "https://unpkg.com"
          ],
          "style-src": [
            "'self'", "'unsafe-inline'",
            "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"
          ],
          "img-src": [
            "'self'", "data:", "blob:",
            "https://maps.gstatic.com", "https://*.googleapis.com"
          ],
          "connect-src": [
            "'self'", "https://maps.googleapis.com",
            "https://www.bitaldatax.com", "https://www.cardscanner.co/es/image-to-text"
          ],
          "frame-src": ["'self'", "blob:", "https://www.google.com"],
          "object-src": ["'none'"],
          "default-src": ["'self'"]
        }
      },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" }
    })
  );

  // 10. Headers de seguridad adicionales
  app.use((req, res, next) => {
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Feature-Policy', "geolocation 'none'; microphone 'none'; camera 'none'");
      next();
  });

  // 11. Configuración avanzada de cookies
  app.use(cookieParser(
      process.env.COOKIE_SECRET || crypto.randomBytes(64).toString('hex'),
      {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000
      }
  ));

  // 12. Configuración de sesiones seguras
  const sessionConfig = {
      store: new MySQLStore({
          host: MYSQLHOST,
          port: MYSQLPORT,
          user: MYSQLUSER,
          password: MYSQLPASSWORD,
          database: MYSQLDATABASE,
          createDatabaseTable: true
      }),
      secret: process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
      resave: false,
      saveUninitialized: false,
      cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000
      },
      name: 'secureSessionId',
      rolling: true,
      unset: 'destroy'
  };

  if (process.env.NODE_ENV === 'production') {
      app.set('trust proxy', 1);
      sessionConfig.cookie.secure = true;
  }

  app.use(session(sessionConfig));
  app.use(flash());

  // 13. CSRF Protection mejorada
  const csrfProtection = csrf({
      cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
      }
  });
  app.use(csrfProtection);

  // 14. Validación de entrada global
  app.use((req, res, next) => {
      // Sanitizar parámetros de consulta
      for (const key in req.query) {
          if (typeof req.query[key] === 'string') {
              req.query[key] = escape(req.query[key]);
          }
      }
      
      // Sanitizar cuerpo de la petición
      if (req.body) {
          for (const key in req.body) {
              if (typeof req.body[key] === 'string') {
                  req.body[key] = escape(req.body[key]);
              }
          }
      }
      
      next();
  });

  // ==================== MIDDLEWARE ADICIONAL ====================

  // Configurar middleware de subida de archivos
  app.use(fileUpload({
      createParentPath: true,
      limits: { fileSize: 5 * 1024 * 1024 },
      abortOnLimit: true,
      safeFileNames: true,
      preserveExtension: true
  }));

  // Middleware de compresión
  app.use(compression());

  // Configurar passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Middleware para pasar datos comunes a las respuestas
  app.use((req, res, next) => {
      // Para API responses en JSON
      res.apiResponse = (data, status = 200, message = '') => {
          const response = {
              success: status >= 200 && status < 300,
              message,
              data
          };
          return res.status(status).json(response);
      };
      
      res.apiError = (message, status = 400, errors = null) => {
          const response = {
              success: false,
              message,
              errors
          };
          return res.status(status).json(response);
      };

      res.locals.csrfToken = req.csrfToken();
      next();
  });

  app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });

  // Base de datos MySQL
  const db = require('./dataBase/dataBase.orm');
  if (db.users) {
    logger.info('Conexión a la base de datos MySQL establecida correctamente.');
  }

  // Base de datos MongoDB (conexión automática)
  require('./dataBase/dataBase.mongo');
  try {
    const UserPreferences = require('./model/nonRelational/UserPreferences');
    await UserPreferences.createCollection();
    console.log('Colecciones de MongoDB listas.');
  } catch (err) {
    console.error('Error creando colecciones en MongoDB:', err);
  }

  // Rutas MYSQL
  app.use('/users', require('./router/users'));
  app.use('/roles', require('./router/roles'));
  app.use('/detalle-rol', require('./router/detalleRol'));
  app.use('/teams', require('./router/teams'));
  app.use('/players', require('./router/players'));
  app.use('/referees', require('./router/referees'));
  app.use('/matches', require('./router/matches'));
  app.use('/news', require('./router/news'));
  app.use('/division', require('./router/division'));
  app.use('/detalle-division', require('./router/detalleDivision'));
  app.use('/estadisticas', require('./router/estadisticas'));
  app.use('/detalle-estadisticas', require('./router/detalleEstadisticas'));
  app.use('/resultados', require('./router/resultados'));
  app.use('/detalle-resultados', require('./router/detalleResultados'));
  app.use('/tarjetas', require('./router/tarjetas'));
  app.use('/canchas', require('./router/canchas'));
  app.use('/detalle-jugadores', require('./router/detalleJugadores'));
  app.use('/posiciones', require('./router/posiciones'));
  app.use('/torneos', require('./router/torneos'));
  app.use('/inscripciones-torneo', require('./router/inscripcionesTorneo'));
  app.use('/agenda-entrenamientos', require('./router/agendaEntrenamientos'));
  app.use('/comentarios', require('./router/comentarios'));


  // Configurar variables globales
  app.use((req, res, next) => {
      app.locals.message = req.flash('message');
      app.locals.success = req.flash('success');
      app.locals.user = req.user || null;
      next();
  });

  // ==================== MANEJO DE ERRORES ====================

  // Middleware de manejo de errores mejorado para API
  app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    logger.error(`Error: ${err.message}\nStack: ${err.stack}`);

    // Respuestas de error estandarizadas
    if (err.name === 'ValidationError') {
        return res.apiError('Validation error', 400, err.errors);
    }

    if (err.code === 'EBADCSRFTOKEN') {
        return res.apiError('CSRF token validation failed', 403);
    }

    // Error no manejado
    const errorResponse = {
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    };
    
    res.status(500).json(errorResponse);
  });

  // Middleware para rutas no encontradas (API)
  app.use((req, res, next) => {
      logger.warn(`404 Not Found: ${req.originalUrl}`);
      if (res.apiError) {
          res.apiError('Endpoint not found', 404);
      } else {
          res.status(404).json({ error: 'Endpoint not found' });
      }
  });

  process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.stack}`);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason.stack || reason}`);
  });

  return app;
}

module.exports = createApp;
