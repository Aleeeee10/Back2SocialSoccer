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

if (MYSQL_URI) {
    sequelize = new Sequelize(MYSQL_URI, {
        dialect: 'mysql',
        dialectOptions: { charset: 'utf8mb4' },
        pool: { max: 20, min: 5, acquire: 30000, idle: 10000 },
        logging: false,
    });
} else {
    sequelize = new Sequelize(MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD, {
        host: MYSQLHOST,
        port: MYSQLPORT,
        dialect: 'mysql',
        dialectOptions: { charset: 'utf8mb4' },
        pool: { max: 20, min: 5, acquire: 30000, idle: 10000 },
        logging: false,
    });
}

sequelize.authenticate()
    .then(() => console.log('Conexión a la base de datos establecida correctamente.'))
    .catch(err => console.error('No se pudo conectar a la base de datos:', err));

const syngOptions = process.env.NODE_ENV === 'development' ? { force: true } : { alter : true };

sequelize.sync(syngOptions)
    .then(() => console.log('Sincronización de la base de datos completada.'))
    .catch(err => console.error('Error al sincronizar la base de datos:', err));

// MODELOS
const users = require('../model/relational/users')(sequelize, Sequelize.DataTypes);
const roles = require('../model/relational/roles')(sequelize, Sequelize.DataTypes);
const detalleRol = require('../model/relational/detalleRol')(sequelize, Sequelize.DataTypes);
const teams = require('../model/relational/teams')(sequelize, Sequelize.DataTypes);
const players = require('../model/relational/players')(sequelize, Sequelize.DataTypes);
const referees = require('../model/relational/referees')(sequelize, Sequelize.DataTypes);
const matches = require('../model/relational/matches')(sequelize, Sequelize.DataTypes);
const news = require('../model/relational/news')(sequelize, Sequelize.DataTypes);
const division = require('../model/relational/division')(sequelize, Sequelize.DataTypes);
const posiciones = require('../model/relational/posiciones')(sequelize, Sequelize.DataTypes);
const estadisticas = require('../model/relational/estadisticas')(sequelize, Sequelize.DataTypes);
const detalleEstadisticas = require('../model/relational/detalleEstadisticas')(sequelize, Sequelize.DataTypes);
const resultados = require('../model/relational/resultados')(sequelize, Sequelize.DataTypes);
const detalleResultados = require('../model/relational/detalleResultados')(sequelize, Sequelize.DataTypes);
const tarjetas = require('../model/relational/tarjetas')(sequelize, Sequelize.DataTypes);
const canchas = require('../model/relational/canchas')(sequelize, Sequelize.DataTypes);
const detalleJugadores = require('../model/relational/detalleJugadores')(sequelize, Sequelize.DataTypes);
const detalleDivision = require('../model/relational/detalleDivision')(sequelize, Sequelize.DataTypes);
const torneos = require('../model/relational/torneos')(sequelize, Sequelize.DataTypes);
const inscripcionesTorneo = require('../model/relational/inscripcionesTorneo')(sequelize, Sequelize.DataTypes);
const agendaEntrenamientos = require('../model/relational/agendaEntrenamientos')(sequelize, Sequelize.DataTypes);
const comentarios = require('../model/relational/comentarios')(sequelize, Sequelize.DataTypes);

// RELACIONES
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

// EXPORT
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
