require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const helmet = require('helmet');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const winston = require('winston');

const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT } = require('./keys');
require('./lib/passport');

async function createApp() {
  const app = express();

  // CORS
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

  // Middlewares de parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Helmet para seguridad
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

  // Logger HTTP
  app.use(morgan('dev'));

  // Sesión
  const sessionStore = new MySQLStore({
    host: MYSQLHOST,
    port: MYSQLPORT,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    database: MYSQLDATABASE,
    createDatabaseTable: true,
  });
  app.use(session({
    secret: process.env.SESSION_SECRET || 'app segura',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  }));

  // Passport y flash
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  // CSRF
  app.use(cookieParser());
  const csrfProtection = csrf({ cookie: true });
  app.use(csrfProtection);
  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  });
  app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });

  // Logger con Winston
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.printf(info => `${info.timestamp} [${info.level}] ${info.message} ${info.stack || ''}`)
    ),
    transports: [
      new winston.transports.File({
        filename: 'app.log',
        level: 'info',
        maxsize: 5242880,
        maxFiles: 5,
      })
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: 'app.log' })
    ]
  });
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
  }

  // Puerto
  app.set('port', process.env.PORT || 3000);

  // Base de datos MySQL
  const db = require('./dataBase/dataBase.orm');
  if (db.sequelize && db.sequelize.authenticate) {
    db.sequelize.authenticate()
      .then(() => logger.info('Conexión a la base de datos MySQL establecida correctamente.'))
      .catch(err => logger.error('Error al conectar a la base de datos MySQL: ' + err.stack));
    db.sequelize.sync()
      .then(() => logger.info('Sincronización de la base de datos completada.'))
      .catch(err => logger.error('Error al sincronizar la base de datos: ' + err.stack));
  }

  // Base de datos MongoDB
  const connectMongoDB = require('./dataBase/dataBase.mongo');
  await connectMongoDB();
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

  // Rutas MONGO
  app.use('/activity-logs', require('./router/activityLogs'));
  app.use('/favoritos', require('./router/favoritos'));
  app.use('/mensajes', require('./router/mensajes'));
  app.use('/notifications-log', require('./router/notificationsLog'));

  // Middleware global de errores
  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    logger.error(`${err.message}\n${err.stack}`);
    if (err.code === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === 'EBADCSRFTOKEN') {
      return res.status(403).send('Invalid CSRF token');
    }
    return res.status(500).send('Internal Server Error');
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
