require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const witson = require('winston');

const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT } = require('./keys');
require('./lib/passport');

// Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://maps.googleapis.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
          "https://unpkg.com"
        ],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net"
        ],
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          "https://maps.gstatic.com",
          "https://*.googleapis.com"
        ],
        "connect-src": [
          "'self'",
          "https://maps.googleapis.com",
          "https://www.bitaldatax.com",
          "https://www.cardscanner.co/es/image-to-text"
        ],
        "frame-src": ["'self'", "blob:", "https://www.google.com"],
        "object-src": ["'none'"],
        "default-src": ["'self'"]
      }
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  })
);

// Sesiones
const mysqlStore = {
  host: MYSQLHOST,
  port: MYSQLPORT,
  user: MYSQLUSER,
  password: MYSQLPASSWORD,
  database: MYSQLDATABASE,
  createDatabaseTable: true,
};
const sessionStore = new MySQLStore(mysqlStore);

app.use(session({
  secret: process.env.SESSION_SECRET || 'app segura',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
}));

// Logger Winston
const logger = witson.createLogger({
  level: 'info',
  format: witson.format.combine(
    witson.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    witson.format.errors({ stack: true }),
    witson.format.printf(info => `${info.timestamp} [${info.level}] ${info.message} ${info.stack || ''}`)
  ),
  transports: [
    new witson.transports.File({
      filename: 'app.log',
      level: 'info',
      maxsize: 5242880,
      maxFiles: 5,
    })
  ],
  exceptionHandlers: [
    new witson.transports.File({ filename: 'app.log' })
  ]
});

// Puerto
app.set('port', process.env.PORT || 3000);

// Conexión DB MySQL Sequelize
const db = require('./dataBase/dataBase.orm');
if (db.sequelize && db.sequelize.authenticate) {
  db.sequelize.authenticate()
    .then(() => logger.info('Conexión a la base de datos MySQL establecida correctamente.'))
    .catch(err => logger.error('Error al conectar a la base de datos MySQL: ' + err.stack));

  db.sequelize.sync()
    .then(async () => {
      logger.info('Sincronización de la base de datos completada.');
      const initRoles = require('../utils/initRoles');
      await initRoles();
    })
    .catch(err => logger.error('Error al sincronizar la base de datos: ' + err.stack));
}

// Morgan para HTTP
const morganStream = {
  write: (message) => {
    logger.info(message.trim());
  }
};
app.use(morgan('combined', { stream: morganStream }));

if (process.env.NODE_ENV !== 'production') {
  logger.add(new witson.transports.Console({
    format: witson.format.combine(
      witson.format.colorize(),
      witson.format.simple()
    )
  }));
}

// Middleware de errores globales
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

// Flash
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  if (typeof req.flash === 'function') {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
  } else {
    res.locals.success = [];
    res.locals.error = [];
  }
  next();
});

// CSRF
const milderwarCsrf = csrf({ cookie: true });
app.use(cookieParser());
app.use(milderwarCsrf);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ✅ RUTAS ADICIONALES
const usersRoutes = require('./router/users.routes');
app.use('/users', usersRoutes);

const rolRoutes = require('./router/rol.router');
app.use('/roles', rolRoutes);

// ✅ RUTAS PRINCIPALES
app.use('/teams', require('./router/teams.router'));
app.use('/players', require('./router/players.router'));
app.use('/referees', require('./router/referees.router'));
app.use('/matches', require('./router/matches.router'));
app.use('/news', require('./router/news.router'));
app.use('/standings', require('./router/standings.router'));
app.use('/division', require('./router/division.router'));
app.use('/detalle-division', require('./router/detalleDivision.router'));
app.use('/estadisticas', require('./router/estadisticas.router'));
app.use('/detalle-estadisticas', require('./router/detalleEstadisticas.router'));
app.use('/resultados', require('./router/resultados.router'));
app.use('/detalle-resultados', require('./router/detalleResultados.router'));
app.use('/tarjetas', require('./router/tarjetas.router'));
app.use('/canchas', require('./router/canchas.router'));
app.use('/detalle-jugadores', require('./router/detalleJugadores.router'));
app.use('/auth', require('./router/auth.router'));

// ✅ RUTA DASHBOARD
const dashboardRoutes = require('./router/dashboard.routes');
app.use('/admin/dashboard', dashboardRoutes);

// Conexión Mongo
const connectMongoDB = require('./dataBase/dataBase.mongo');
connectMongoDB().then(async () => {
  try {
    const UserPreferences = require('./model/userPreferences.model');
    await UserPreferences.createCollection();
    console.log('Colecciones de MongoDB listas.');
  } catch (err) {
    console.error('Error creando colecciones en MongoDB:', err);
  }
});

module.exports = app;
