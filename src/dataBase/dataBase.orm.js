const { Sequelize } = require("sequelize");
const {
    MYSQLHOST,
    MYSQLUSER,
    MYSQLPASSWORD,
    MYSQLDATABASE,
    MYSQLPORT,
    MYSQL_URI
} = require("../keys");

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

// Sincronización de la base de datos - Configuración segura para evitar "Too many keys"
const syncOptions = { alter: false }; // No alterar estructura existente, solo verificar

sequelize.sync(syncOptions)
    .then(() => {
        console.log('Base de Datos sincronizadas (modo seguro)');
    })
    .catch((error) => {
        console.error('Error al sincronizar la Base de Datos:', error);
    });

//extraccion de Modelos
const usersModel = require('../model/relational/users');
const rolesModel = require('../model/relational/roles');
const detalleRolModel = require('../model/relational/detalleRol');
const teamsModel = require('../model/relational/teams');
const playersModel = require('../model/relational/players');
const refereesModel = require('../model/relational/referees');
const matchesModel = require('../model/relational/matches');
const newsModel = require('../model/relational/news');
const divisionModel = require('../model/relational/division');
const posicionesModel = require('../model/relational/posiciones');
const estadisticasModel = require('../model/relational/estadisticas');
const detalleEstadisticasModel = require('../model/relational/detalleEstadisticas');
const resultadosModel = require('../model/relational/resultados');
const detalleResultadosModel = require('../model/relational/detalleResultados');
const tarjetasModel = require('../model/relational/tarjetas');
const canchasModel = require('../model/relational/canchas');
const detalleJugadoresModel = require('../model/relational/detalleJugadores');
const detalleDivisionModel = require('../model/relational/detalleDivision');
const torneosModel = require('../model/relational/torneos');
const inscripcionesTorneoModel = require('../model/relational/inscripcionesTorneo');
const agendaEntrenamientosModel = require('../model/relational/agendaEntrenamientos');
const comentariosModel = require('../model/relational/comentarios');

//instanciar los modelos a sincronizar
const users = usersModel(sequelize, Sequelize.DataTypes);
const roles = rolesModel(sequelize, Sequelize.DataTypes);
const detalleRol = detalleRolModel(sequelize, Sequelize.DataTypes);
const teams = teamsModel(sequelize, Sequelize.DataTypes);
const players = playersModel(sequelize, Sequelize.DataTypes);
const referees = refereesModel(sequelize, Sequelize.DataTypes);
const matches = matchesModel(sequelize, Sequelize.DataTypes);
const news = newsModel(sequelize, Sequelize.DataTypes);
const division = divisionModel(sequelize, Sequelize.DataTypes);
const posiciones = posicionesModel(sequelize, Sequelize.DataTypes);
const estadisticas = estadisticasModel(sequelize, Sequelize.DataTypes);
const detalleEstadisticas = detalleEstadisticasModel(sequelize, Sequelize.DataTypes);
const resultados = resultadosModel(sequelize, Sequelize.DataTypes);
const detalleResultados = detalleResultadosModel(sequelize, Sequelize.DataTypes);
const tarjetas = tarjetasModel(sequelize, Sequelize.DataTypes);
const canchas = canchasModel(sequelize, Sequelize.DataTypes);
const detalleJugadores = detalleJugadoresModel(sequelize, Sequelize.DataTypes);
const detalleDivision = detalleDivisionModel(sequelize, Sequelize.DataTypes);
const torneos = torneosModel(sequelize, Sequelize.DataTypes);
const inscripcionesTorneo = inscripcionesTorneoModel(sequelize, Sequelize.DataTypes);
const agendaEntrenamientos = agendaEntrenamientosModel(sequelize, Sequelize.DataTypes);
const comentarios = comentariosModel(sequelize, Sequelize.DataTypes);

//relaciones o foreignKeys - Optimizadas para evitar exceso de índices
users.belongsTo(roles, { as: 'rol', foreignKey: 'roleId' });
roles.hasMany(users, { as: 'users', foreignKey: 'roleId' });

users.hasMany(detalleRol, { foreignKey: 'userId' });
detalleRol.belongsTo(users, { foreignKey: 'userId' });
roles.hasMany(detalleRol, { foreignKey: 'roleId' });
detalleRol.belongsTo(roles, { foreignKey: 'roleId' });

teams.hasMany(players, { foreignKey: 'teamId' });
players.belongsTo(teams, { foreignKey: 'teamId' });

teams.belongsTo(division, { foreignKey: 'divisionId' });
division.hasMany(teams, { foreignKey: 'divisionId' });

matches.belongsTo(teams, { as: 'equipoLocal', foreignKey: 'equipoLocalId' });
matches.belongsTo(teams, { as: 'equipoVisitante', foreignKey: 'equipoVisitanteId' });
matches.belongsTo(referees, { foreignKey: 'refereeId' });

matches.belongsTo(canchas, { foreignKey: 'canchaId' });
canchas.hasMany(matches, { foreignKey: 'canchaId' });

matches.hasMany(resultados, { foreignKey: 'matchId' });
resultados.belongsTo(matches, { foreignKey: 'matchId' });

resultados.hasMany(detalleResultados, { foreignKey: 'resultadoId' });
detalleResultados.belongsTo(resultados, { foreignKey: 'resultadoId' });

players.hasMany(detalleResultados, { foreignKey: 'playerId' });
detalleResultados.belongsTo(players, { foreignKey: 'playerId' });

estadisticas.hasMany(detalleEstadisticas, { foreignKey: 'estadisticaId' });
detalleEstadisticas.belongsTo(estadisticas, { foreignKey: 'estadisticaId' });

players.hasMany(detalleEstadisticas, { foreignKey: 'playerId' });
detalleEstadisticas.belongsTo(players, { foreignKey: 'playerId' });

matches.hasMany(tarjetas, { foreignKey: 'matchId' });
tarjetas.belongsTo(matches, { foreignKey: 'matchId' });

players.hasMany(tarjetas, { foreignKey: 'playerId' });
tarjetas.belongsTo(players, { foreignKey: 'playerId' });

teams.hasMany(posiciones, { foreignKey: 'teamId' });
posiciones.belongsTo(teams, { foreignKey: 'teamId' });
division.hasMany(posiciones, { foreignKey: 'divisionId' });
posiciones.belongsTo(division, { foreignKey: 'divisionId' });

players.hasMany(detalleJugadores, { foreignKey: 'playerId' });
detalleJugadores.belongsTo(players, { foreignKey: 'playerId' });

division.hasMany(detalleDivision, { foreignKey: 'divisionId' });
detalleDivision.belongsTo(division, { foreignKey: 'divisionId' });
players.hasMany(detalleDivision, { foreignKey: 'playerId' });
detalleDivision.belongsTo(players, { foreignKey: 'playerId' });

teams.hasMany(agendaEntrenamientos, { foreignKey: 'teamId' });
agendaEntrenamientos.belongsTo(teams, { foreignKey: 'teamId' });

// Exportar el objeto sequelize
module.exports = {
    sequelize,
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
