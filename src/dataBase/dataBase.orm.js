const { Sequelize } = require("sequelize");
const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT, MYSQL_URI } = require("../keys");

let sequelize;

// Usar URI de conexión si está disponible
if (MYSQL_URI) {
    sequelize = new Sequelize(MYSQL_URI, {
        dialect: 'mysql',
        dialectOptions: {
            charset: 'utf8mb4', // Soporte para caracteres especiales
        },
        pool: {
            max: 20, // Número máximo de conexiones
            min: 5,  // Número mínimo de conexiones
            acquire: 30000, // Tiempo máximo en ms para obtener una conexión
            idle: 10000 // Tiempo máximo en ms que una conexión puede estar inactiva
        },
        logging: false // Desactiva el logging para mejorar el rendimiento
    });
} else {
    // Configuración para parámetros individuales
    sequelize = new Sequelize(MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD, {
        host: MYSQLHOST,
        port: MYSQLPORT,
        dialect: 'mysql',
        dialectOptions: {
            charset: 'utf8mb4', // Soporte para caracteres especiales
        },
        pool: {
            max: 20, // Número máximo de conexiones
            min: 5,  // Número mínimo de conexiones
            acquire: 30000, // Tiempo máximo en ms para obtener una conexión
            idle: 10000 // Tiempo máximo en ms que una conexión puede estar inactiva
        },
        logging: false // Desactiva el logging para mejorar el rendimiento
    });
}

// Autenticar y sincronizar
sequelize.authenticate()
    .then(() => {
        console.log("Conexión establecida con la base de datos");
    })
    .catch((err) => {
        console.error("No se pudo conectar a la base de datos:", err.message);
    });

// Sincronización de la base de datos
const syncOptions = process.env.NODE_ENV === 'development' ? { force: true } : { alter: true };

sequelize.sync(syncOptions)
    .then(() => {
        console.log('Base de Datos sincronizadas');
    })
    .catch((error) => {
        console.error('Error al sincronizar la Base de Datos:', error);
    });

// Extracción de modelos
const usersModel = require('../model/relational/users')
const rolesModel = require('../model/relational/roles')
const detalleRolModel = require('../model/relational/detalleRol')
const teamsModel = require('../model/relational/teams')
const playersModel = require('../model/relational/players')
const refereesModel = require('../model/relational/referees')
const matchesModel = require('../model/relational/matches')
const newsModel = require('../model/relational/news')
const divisionModel = require('../model/relational/division')
const posicionesModel = require('../model/relational/posiciones')
const estadisticasModel = require('../model/relational/estadisticas')
const detalleEstadisticasModel = require('../model/relational/detalleEstadisticas')
const resultadosModel = require('../model/relational/resultados')
const detalleResultadosModel = require('../model/relational/detalleResultados')
const tarjetasModel = require('../model/relational/tarjetas')
const canchasModel = require('../model/relational/canchas')
const detalleJugadoresModel = require('../model/relational/detalleJugadores')
const detalleDivisionModel = require('../model/relational/detalleDivision')
const torneosModel = require('../model/relational/torneos')
const inscripcionesTorneoModel = require('../model/relational/inscripcionesTorneo')
const agendaEntrenamientosModel = require('../model/relational/agendaEntrenamientos')
const comentariosModel = require('../model/relational/comentarios')

// Instanciar los modelos a sincronizar
const users = usersModel(sequelize, Sequelize)
const roles = rolesModel(sequelize, Sequelize)
const detalleRol = detalleRolModel(sequelize, Sequelize)
const teams = teamsModel(sequelize, Sequelize)
const players = playersModel(sequelize, Sequelize)
const referees = refereesModel(sequelize, Sequelize)
const matches = matchesModel(sequelize, Sequelize)
const news = newsModel(sequelize, Sequelize)
const division = divisionModel(sequelize, Sequelize)
const posiciones = posicionesModel(sequelize, Sequelize)
const estadisticas = estadisticasModel(sequelize, Sequelize)
const detalleEstadisticas = detalleEstadisticasModel(sequelize, Sequelize)
const resultados = resultadosModel(sequelize, Sequelize)
const detalleResultados = detalleResultadosModel(sequelize, Sequelize)
const tarjetas = tarjetasModel(sequelize, Sequelize)
const canchas = canchasModel(sequelize, Sequelize)
const detalleJugadores = detalleJugadoresModel(sequelize, Sequelize)
const detalleDivision = detalleDivisionModel(sequelize, Sequelize)
const torneos = torneosModel(sequelize, Sequelize)
const inscripcionesTorneo = inscripcionesTorneoModel(sequelize, Sequelize)
const agendaEntrenamientos = agendaEntrenamientosModel(sequelize, Sequelize)
const comentarios = comentariosModel(sequelize, Sequelize)

// Relaciones o foreingKeys
users.belongsTo(roles, { foreignKey: 'idRol', as: 'rol' });
roles.hasMany(users, { foreignKey: 'idRol', as: 'users' });

users.hasMany(detalleRol, { foreignKey: 'idUser' });
detalleRol.belongsTo(users, { foreignKey: 'idUser' });
roles.hasMany(detalleRol, { foreignKey: 'idRol' });
detalleRol.belongsTo(roles, { foreignKey: 'idRol' });

teams.hasMany(players);
players.belongsTo(teams);

teams.belongsTo(division, { foreignKey: 'divisionId' });
division.hasMany(teams, { foreignKey: 'divisionId' });

matches.belongsTo(teams, { as: 'equipoLocal', foreignKey: 'localId' });
matches.belongsTo(teams, { as: 'equipoVisitante', foreignKey: 'visitanteId' });
matches.belongsTo(referees, { foreignKey: 'refereeId' });

matches.belongsTo(canchas, { foreignKey: 'canchaId' });
canchas.hasMany(matches, { foreignKey: 'canchaId' });

matches.hasMany(resultados);
resultados.belongsTo(matches);

resultados.hasMany(detalleResultados);
detalleResultados.belongsTo(resultados);

players.hasMany(detalleResultados);
detalleResultados.belongsTo(players);

estadisticas.hasMany(detalleEstadisticas);
detalleEstadisticas.belongsTo(estadisticas);

players.hasMany(detalleEstadisticas);
detalleEstadisticas.belongsTo(players);

matches.hasMany(tarjetas);
tarjetas.belongsTo(matches);

players.hasMany(tarjetas);
tarjetas.belongsTo(players);

teams.hasMany(posiciones);
posiciones.belongsTo(teams);
division.hasMany(posiciones);
posiciones.belongsTo(division);

players.hasMany(detalleJugadores);
detalleJugadores.belongsTo(players);

division.hasMany(detalleDivision);
detalleDivision.belongsTo(division);
players.hasMany(detalleDivision);
detalleDivision.belongsTo(players);

teams.hasMany(agendaEntrenamientos);
agendaEntrenamientos.belongsTo(teams);

// Exportar el objeto sequelize
module.exports = {
    users,
    roles,
    detalleRol,
    teams,
    players,
    referees,
    matches,
    news,
    division,
    posiciones,
    estadisticas,
    detalleEstadisticas,
    resultados,
    detalleResultados,
    tarjetas,
    canchas,
    detalleJugadores,
    detalleDivision,
    torneos,
    inscripcionesTorneo,
    agendaEntrenamientos,
    comentarios
};
